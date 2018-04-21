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
    displayItems();
});

function displayItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        res.forEach(function (item) {
            console.log(`${item.id} ${item.product_name}, $${item.price}`);
        });
    });
    promptCustomer();
}

function promptCustomer() {
    iquirer.prompt([
        {
            name: "product",
            type: "input",
            message: "Please give the id of the item you would like to buy."
            //add validation, maybe change input to available types
        },
        {
            name: "product",
            type: "units",
            message: "How many units of this item would you like to buy?"
            //add validation
        }
    ])
        .then(function (answer) {
            // check if your store has enough of the product 
                //select stock quantity by id from products, if >= units then continue
            // If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

            // However, if your store does have enough of the product...
            // This means updating the SQL database to reflect the remaining quantity
                //update item by id and make stock_quantity = to current - units
            // Once the update goes through, show the customer the total cost of their purchase.
                //console log units * item price
        });
}



