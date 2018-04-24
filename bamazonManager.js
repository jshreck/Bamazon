var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
});

connection.connect((err) => {
    if (err) throw err;
    displayOptions();
});


//for validating if answer is an integer
function isInt(int) {
    return (isNaN(parseInt(int)) ? "Please type in an integer" : true);
}

function displayOptions() {
    inquirer.prompt([
        {
            name: "options",
            type: "list",
            message: "\nWhat would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Existing Inventory", "Add New Product", new inquirer.Separator(), "Exit"]
        }
    ])
        .then((answer) => {
            switch (answer.options) {

                case "View Products for Sale":
                    listItems();
                    break;

                case "View Low Inventory":
                    lowInventory();
                    break;

                case "Add to Existing Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    newProduct();
                    break

                case "Exit":
                    connection.end();
            }
        });
}

//lists all items for sale
function listItems() {
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;

        var table = new Table({
            head: ["Item ID", "Name", "Price", "Quantity in Stock"]
        });

        res.forEach((item) => {
            table.push([item.id, item.product_name, `$${item.price.toFixed(2)}`, item.stock_quantity]);
        });

        console.log(table.toString());
        next();
    });
}

//list all items with inventory count lower than 20
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 20", (err, res) => {
        if (err) throw err;

        var table = new Table({
            head: ["Item ID", "Name", "Quantity in Stock"]
        });

        res.forEach((item) => {
            table.push([item.id, item.product_name, item.stock_quantity]);
        });
        
        console.log("LOW INVENTORY:")
        console.log(table.toString());
        next();
    });
}

//allow user to add quantity to existing items for sale
function addInventory() {

    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "\nWhat is the id of the product you wish to add inventory to?",
            validate: isInt
        },
        {
            name: "quantity",
            type: "input",
            message: "\nHow many units would you like to add to inventory?",
            validate: isInt
        }
    ])
        .then((answers) => {

            connection.query("SELECT * FROM products WHERE ?", { id: answers.id }, (err, res) => {

                var newStock = res[0].stock_quantity + parseInt(answers.quantity);
                var name = res[0].product_name;
                var id = res[0].id;

                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newStock
                        },
                        {
                            id: answers.id
                        }
                    ],
                    (err, res) => {
                        if (err) throw err;

                        var table = new Table({
                            head: ["Item ID", "Name", "Quantity in Stock"]
                        });
                        table.push([id, name, newStock]);
        
                        console.log(table.toString());
                        console.log("Successfully updated inventory!")
                        next();
                    });
            });
        });
}

//allow user to add new product
function newProduct() {
    inquirer.prompt([
        {
            name: "product_name",
            type: "input",
            message: "\nWhat is the name of the item you would like to add?",
        },
        {
            name: "department_name",
            type: "input",
            message: "\nWhat department should this item be in?",
        },
        {
            name: "price",
            type: "input",
            message: "\nWhat is the price of the item?",
            validate:(num) => {
                return (isNaN(num) ? "Please type in a number" : true);
            }
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "\nHow many units would you like to add to inventory?",
            validate: isInt
        },
    ])
        .then((answers) => {

            connection.query("INSERT INTO products SET ?",
                {
                    product_name: answers.product_name, 
                    department_name: answers.department_name, 
                    price: answers.price, 
                    stock_quantity: answers.stock_quantity
                },
                (err, res) => {
                    if (err) throw err;
                    
                    var table = new Table({
                        head: ["Name", "Department", "Price", "Quantity in Stock"]
                    });

                    var price = Number(answers.price).toFixed(2);
                    table.push([answers.product_name, answers.department_name, `$${price}`, answers.stock_quantity])

                    console.log(table.toString());
                    console.log("Successfully added new item to inventory!");
                    next();
                });   
        });
}

//ask if user want to do something else or want to exit
function next() {
    inquirer.prompt([
        {
            name: "next",
            type: "list",
            message: "\nWould you like to do something else?",
            choices: ["Yes", "Exit"]
        }
    ])
        .then((answer) => {
            switch (answer.next) {

                case "Yes":
                    displayOptions();
                    break;

                case "Exit":
                    connection.end();
            }
        });
}
