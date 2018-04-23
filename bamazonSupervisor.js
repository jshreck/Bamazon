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

function displayOptions() {
    inquirer.prompt([
        {
            name: "options",
            type: "list",
            message: "\nWhat would you like to do?",
            choices: ["View Sales by Department", "Create New Department", new inquirer.Separator(), "Exit"]
        }
    ])
        .then((answer) => {
            switch (answer.options) {

                case "View Sales by Department":
                    viewSales();
                    break;

                case "Create New Department":
                    newDept();
                    break;

                case "Exit":
                    connection.end();
            }
        });
}






//display sales by department
function viewSales() {
    //this joins the tables, need to total product_sales if depts match and then calc total profit (overhead-total sales)
    connection.query(`SELECT * FROM departments 
    LEFT JOIN 
    (SELECT department_name, sum(product_sales) AS department_sales
    FROM products 
    GROUP BY department_name) 
    sum ON (departments.department_name = sum.department_name)`, (err, res) => {
        if (err) throw err;

        var table = new Table({
            head: ["Department ID", "Department Name", "Overhead Costs", "Sales", "Total Profit"]
        });

        res.forEach((dept) => { 
            var deptName =dept.department_name;
            var overhead = dept.over_head_costs.toFixed(2); 
            var deptSales = Number(dept.department_sales).toFixed(2); //turns null to 0
            var totalProfits = (deptSales - overhead).toFixed(2);   

            //=====================
            //error here if no products in dept, name= null 
            if (dept.department_name === null) {
                deptName = "???"; //how to grab this?
            }     
            //====================== 
            table.push([dept.department_id, deptName, `$${overhead}`, `$${deptSales}`, `$${totalProfits}`]);
        });

        console.log(table.toString());
        next();
    });
}

//allow user to add new department
function newDept() {
    inquirer.prompt([
        {
            name: "department_name",
            type: "input",
            message: "\nWhat is the name of the department you would like to add?",
        },
        {
            name: "costs",
            type: "input",
            message: "\nWhat are the overhead costs for this department?",
            validate:(num) => {
                return (isNaN(num) ? "Please type in a number" : true);
            }
        }
    ])
        .then((answers) => {

            connection.query("INSERT INTO departments SET ?",
                {
                    department_name: answers.department_name, 
                    over_head_costs: answers.costs, 
                },
                (err, res) => {
                    if (err) throw err;
                    
                    var table = new Table({
                        head: ["Department", "Overhead Costs"]
                    });

                    var costs = Number(answers.costs).toFixed(2);
                    table.push([answers.department_name, `$${costs}`])

                    console.log(table.toString());
                    console.log("Successfully added new department!");
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