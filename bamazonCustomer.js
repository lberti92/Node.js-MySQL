var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    productToSale();
})


function productToSale() {
    connection.query("SELECT * FROM products", function (err, data) {
        if (err) throw err;
        for (var i = 0; i < data.length; i++) {
            console.log("Item ID: " + data[i].item_id + " || Product Name: " + data[i].product_name + " || Price: " + data[i].price);
        }
        inquirer.prompt([
            {
                message: "What would product would you like to buy?  Please input the ID number.",
                name: "idItem",
                type: "input",
                validate: function (value) {
                    for (var i = 0; i < data.length; i++) {
                        if (parseInt(data[i].item_id) === parseInt(value)) {
                            return true;
                        }
                    }
                    return "Please return a valid Item ID ";
                }
            },
            {
                name: "units",
                type: "input",
                message: "How many units of the product would you like to buy?",
                validate: function (value) {
                    if (isNaN(value)) {
                        return false;
                    }
                    return true;
                }
            },
            
        ]).then(function (answer) {
                  var chosenItem;
            for (var i = 0; i < data.length; i++) {

                if (data[i].item_id === parseInt(answer.idItem)) {
                    chosenItem = data[i];   
                }
            }
            if (chosenItem.stock_quantity >= parseInt(answer.units)) {
                var updateStock = chosenItem.stock_quantity - answer.units;
                var purchasePrice = chosenItem.price * answer.units;
                
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: updateStock
                        },
                        {
                            item_id: chosenItem.item_id
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("Purchased placed successfully!")  
                        console.log(`Your cost for the ${answer.units} ${chosenItem.product_name} is $${purchasePrice.toFixed(2)}.  Thank you for your purchase!!`);
                        connection.end();
                    }
                );
            }
            else {
                console.log("Insufficient Quantity!! Try again...");
                productToSale();
            }
        });
    });
}