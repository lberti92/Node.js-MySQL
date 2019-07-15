var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    post: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    menuOptions();
});

function menuOptions() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add new product",
                "Exit"
            ]
        }).then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    productForSale();
                    break;

                case "View Low Inventory":
                    lowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add new product":
                    newProduct();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
};

function productForSale() {
    connection.query("SELECT * FROM products", function (err, data) {
        if (err) throw err;
        for (var i = 0; i < data.length; i++) {
            console.log("Item ID: " + data[i].item_id + " || Product Name: " + data[i].product_name + " || Price: " + data[i].price + " || Quantity: " + data[i].stock_quantity);
        }
        menuOptions();
    });
};

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, data) {
        if (err) throw err;
        for (var i = 0; i < data.length; i++) {
            console.log("Item ID: " + data[i].item_id + " || Product Name: " + data[i].product_name + " || Price: " + data[i].price + " || Quantity: " + data[i].stock_quantity);
        }
        menuOptions();
    });
};

function addInventory() {
    connection.query("SELECT * FROM products", function (err, data) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < data.length; i++) {
                            choiceArray.push(data[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "What item would you like to add quantity to: "
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How much quantity to add: ",
                    validate: function (value) {
                        if (isNaN(value)) {
                            return "Please input a correct quantity number?";
                        }
                        return true;
                    }
                }
            ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].product_name === answer.choice) {
                        chosenItem = data[i];
                    }
                }
                var updateQuantity = chosenItem.stock_quantity + parseInt(answer.quantity);

                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: updateQuantity
                        },
                        {
                            product_name: chosenItem.product_name
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log(`Successfully updated quantity to ${updateQuantity}. \n`);
                        menuOptions();
                    });
            });
    });
};

function newProduct() {
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "Input item id: ",
                validate: function (value) {
                    if (isNaN(value)) {
                        return "Please input a correct item id number?";
                    }
                    return true;
                }
            },
            {
                name: "product",
                type: "input",
                message: "Input name of product: "
            },
            {
                name: "department",
                type: "input",
                message: "Input name of department: "
            },
            {
                name: "price",
                type: "input",
                message: "Input price of the product: ",
                validate: function (value) {
                    if (isNaN(value)) {
                        return "Please input a correct price.";
                    }
                    return true;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "Input quantity of the product: ",
                validate: function (value) {
                    if (isNaN(value)) {
                        return "Please input a correct quantity.";
                    }
                    return true;
                }
            },
        ]).then(function (answer) {
            connection.query("SELECT * FROM products", function (err, data) {
                if (err) throw err;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].item_id === parseInt(answer.item)) {
                        console.log("Item ID was a duplicate!!\n\n");
                        menuOptions();
                    }
                }
                connection.query("INSERT INTO products SET ?",
                {
                    item_id: answer.item,
                    product_name: answer.product,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantity
                },
                function (err) {
                    if (err) throw err;
                    console.log("The new product was successfully added!");
                    productForSale();
                });
            });
        });
    }
