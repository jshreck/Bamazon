#Bamazon
***
An Amazon-like storefront using Node.js and MySQL. 

**`BamazonCustomer.js`**

* Prints the products and product Ids
* Asks the customer which item they would like to purchase and how many units
* If there is not enough of the product in stock, a meesage will print out indicating quantity in stock in insufficient
* If purchse is successful, prints out the total cost and updates the "store" with remaining quantity and amount in saales for product

**`BamazonManager.js`**

* Prompts manager with options manager to view products for sale, view low inventory, add to existing inventory, or add a new product

* View Products for Sale: Displays table of all of the products including department and price.
* View Low Inventory: Displays table of all the products with less than 20 items in stock.
* Add to Existing Inventory: Prompts the user to select a product by id and amount ot add to product's stock quantity.
* Add New Product: Prompts the user for info of product to add to store (name, department, price, quantity).
