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
    displayItems();
});

function displayItems() {
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;

        var table = new Table({
            head: ["Item ID", "Name", "Price"]
        });

        res.forEach((item) => {
            table.push([item.id, item.product_name, `$${item.price.toFixed(2)}`]);
        });
        console.log(table.toString());
        promptCustomer();
    });
}

//for validating answers are integers in promptCustomer()
function isInt(int) {
    return (isNaN(parseInt(int)) ? "Please type in an integer" : true);
}

function promptCustomer() {
    inquirer.prompt
        ([
            {
                name: "product",
                type: "input",
                message: "Please give the id of the item you would like to buy.",
                validate: isInt
            },
            {
                name: "unit",
                type: "input",
                message: "How many units of this item would you like to buy?",
                validate: isInt
            }
        ])
        .then((answers) => {
            connection.query("SELECT * FROM products WHERE ?", {id: answers.product}, (err, res) => {
                if (err) throw err;

                var item = res[0];

                // check if store has enough of the product 
                if (item.stock_quantity >= answers.unit) {

                    //update quantity in db
                    var remainingStock = item.stock_quantity - answers.unit;
                    var totalCost = (answers.unit * item.price);
                    var totalSales = item.product_sales + Number(totalCost);

                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            { 
                                stock_quantity: remainingStock, 
                                product_sales: totalSales
                            },
                            { 
                                id: answers.product 
                            }
                        ],
                        //log total cost
                        (err, res) => {
                            if (err) throw err;
                            console.log(`Total cost: $${totalCost}`);
                        });
                }

                // if not enough quantity, give user message
                else {
                    console.log("Insufficient quantity");
                }
                connection.end();    
            });
        });
}



