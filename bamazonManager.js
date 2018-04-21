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

function displayOptions() {
    inquirer.prompt([
        {
            name: "options",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            //add filter?
        }
    ])
        .then(function (answer) {
            switch (answer){
            // If a manager selects View Products for Sale
            case "View products for Sale":
            listItems();
            // If a manager selects View Low Inventory
            case "View Low Inventory":
            lowInventory();
            // If a manager selects Add to Inventory 
            case "Add to Inventory":
            addInventory();
            // If a manager selects Add New Product
            case "Add New Product":
            newProduct();
            }
        });
}



function listItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        res.forEach(function (item) {
            console.log(`${item.id} ${item.product_name}, $${item.price}, ${item.stock_quantity} in stock`);
        });
    });
}

function lowInventory(){
    console.log("low");
//then it should list all items with an inventory count lower than five.
}

function addInventory(){
    console.log("add");
//prompt that will let the manager "add more" of any item currently in the store.
    //prompt for item id and then quantity to add, select by id and add to stock_quantity
}

function newProduct() {
    console.log("new");
    //allow the manager to add a completely new product to the store
        //prompt for name of product, department, price, and quantity -> then add new row to table
        //validate item (name) doesn't already exist?
}