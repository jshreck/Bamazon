var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    displayOptions();
});


//for validations
function isNum(num) {
    return (isNaN(parseInt(num)) ? "Please type in an integer" : true);
}

function displayOptions() {
    inquirer.prompt([
        {
            name: "options",
            type: "list",
            message: "\nWhat would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", new inquirer.Separator(), "Exit"]
        }
    ])
        .then(function (answer) {
            switch (answer.options) {

                case "View Products for Sale":
                    listItems();
                    break;

                case "View Low Inventory":
                    lowInventory();
                    break;

                case "Add to Inventory":
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
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        res.forEach(function (item) {
            console.log(`
            ${item.id} ${item.product_name}, $${item.price}, ${item.stock_quantity} in stock`);
        });
        next();
    });
}

//list all items with inventory count lower than 20
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 20", function (err, res) {
        if (err) throw err;
        console.log(`
        LOW INVENTORY:`);
        res.forEach(function (item) {
            console.log(`
            ${item.product_name}, ID: ${item.id}, Quantity in stock: ${item.stock_quantity} `);
        });
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
            validate: isNum
        },
        {
            name: "quantity",
            type: "input",
            message: "\nHow many units would you like to add to inventory?",
            validate: isNum
        }
    ])
        .then(function (answers) {

            connection.query("SELECT * FROM products WHERE ?", { id: answers.id }, function (err, res) {

                var newStock = res[0].stock_quantity + parseInt(answers.quantity);
                console.log(typeof answers.quantity);
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
                    function (err, res) {
                        if (err) throw err;
                        console.log(`Successfully added inventory to item id ${id}, ${name}. Quantity now in stock: ${newStock}`);
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
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "\nHow many units would you like to add to inventory?",
            validate: isNum
        },
    ])
        .then(function (answers) {


            //SOME SORT OF ERROR HERE
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: answers.product_name, 
                    department_name: answers.department_name, 
                    price: answers.price, 
                    stock_quantity: answers.stock_quantity
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(`Successfully added new item to inventory`);
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
        .then(function (answer) {
            switch (answer.next) {

                case "Yes":
                    displayOptions();
                    break;

                case "Exit":
                    connection.end();
            }
        });
}