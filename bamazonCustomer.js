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
        promptCustomer();
    });
}

//for validating answers in promptCustomer()
function isNum(num) {
    return (isNaN(parseInt(num)) ? "Please type in an integer" : true);
}

function promptCustomer() {
    inquirer.prompt
        ([
            {
                name: "product",
                type: "input",
                message: "Please give the id of the item you would like to buy.",
                validate: isNum
            },
            {
                name: "unit",
                type: "input",
                message: "How many units of this item would you like to buy?",
                validate: isNum
            }
        ])
        .then(function (answers) {
            connection.query("SELECT * FROM products WHERE ?", { id: answers.product }, function (err, res) {
                if (err) throw err;

                var item = res[0];

                // check if store has enough of the product 
                if (item.stock_quantity >= answers.unit) {

                    //update quantity in db
                    var remainingStock = item.stock_quantity - answers.unit;

                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            { stock_quantity: remainingStock },
                            { id: answers.product }
                        ],
                        //log total cost
                        function (err, res) {
                            console.log(`Total cost: ${(answers.unit) * item.price}`);
                        });
                }
                // if not enough quantity, give user message
                else {
                    console.log("Insufficient quantity");
                }
            });
            connection.end();
        });
}



