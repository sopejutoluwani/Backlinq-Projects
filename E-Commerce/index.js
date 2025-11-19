//E-Commerce Shopping Cart System

class Product {
  constructor(id, name, price, stock, category) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.category = category;
  }

  //check if product is in stock
  isInStock() {
    return this.stock > 0;
  }

  //reduce stock when a product is purchased
  reduceStock(quantity) {
    if (quantity <= this.stock) {
      this.stock = this.stock - quantity;
      console.log(
        `${quantity} units of ${this.name} purchased. Remaining stock: ${this.stock}`
      );
    }
  }

  //get product details
  getInfo() {
    return `Product ID: ${this.id}, Name: ${this.name}, Price: $${this.price}, Stock: ${this.stock}, Category: ${this.category}`;
  }
}

//Inheritace for product types
class ElectronicsProduct extends Product {
  constructor(id, name, price, stock, warranty) {
    super(id, name, price, stock, "Electronics");
    this.warranty = warranty; // in months
  }

  //override getInfo method
  getInfo() {
    return `${super.getInfo()}, Warranty: ${this.warranty} months`;
  }
}

class ClothingProduct extends Product {
  constructor(id, name, price, stock, size, color) {
    super(id, name, price, stock, "Clothing");
    this.size = size;
    this.color = color;
  }

  //override getInfo method
  getInfo() {
    return `${super.getInfo()}, Size: ${this.size}, Color: ${this.color}`;
  }
}

//Shopping Cart
class ShoppingCart {
  #items;
  constructor() {
    this.#items = { products: [], quantities: [] };
  }
  //add product to cart
  addItem(product, quantity) {
    //check if product is in stock
    if (product.isInStock() && quantity <= product.stock) {
      this.#items.products.push(product);
      this.#items.quantities.push(quantity);
      console.log(`${quantity} units of ${product.name} added to cart.`);
    } else {
      console.log(
        `Sorry, ${product.name} is out of stock or insufficient quantity available.`
      );
    }
  }

  //remove product from cart
  removeItem(productId) {
    //find index of product in cart
    const index = this.#items.products.findIndex(
      (prod) => prod.id === productId
    );
    if (index >= 0) {
      this.#items.products.splice(index, 1);
      this.#items.quantities.splice(index, 1);
      console.log(`Product ID: ${productId} removed from cart.`);
    } else {
      console.log(`Product ID: ${productId} not found in cart.`);
    }
  }

  //update quantity of a product in cart
  updateQuantity(productId, newQuantity) {
    const index = this.#items.products.findIndex(
      (prod) => prod.id === productId
    );
    if (index >= 0) {
      this.#items.quantities[index] = newQuantity;
      console.log(
        `Quantity for Product ID: ${productId} updated to ${newQuantity}.`
      );
    }
  }

  //calculate total price of items in cart
  totalPrice() {
    let total = 0;
    for (let i = 0; i < this.#items.products.length; i++) {
      total += this.#items.products[i].price * this.#items.quantities[i];
    }
    return total;
  }

  //get the total items in the cart
  getItems() {
    let cartItems = "Items in Cart:\n";
    for (let i = 0; i < this.#items.products.length; i++) {
      cartItems += `${this.#items.products[i].name} - Quantity: ${
        this.#items.quantities[i]
      }\n`;
    }

    let totalItems = this.#items.quantities.reduce((a, b) => a + b, 0);
    cartItems += `Total Items: ${totalItems}\n`;
    //console.log(cartItems);
    return cartItems;
  }

  //get summary of cart items
  getCartSummary() {
    let summary = "Shopping Cart Summary:\n";
    for (let i = 0; i < this.#items.products.length; i++) {
      summary += `${this.#items.products[i].name} - Quantity: ${
        this.#items.quantities[i]
      }, Price per unit: $${this.#items.products[i].price}\n`;
    }
    summary += `Total Price: $${this.totalPrice()}`;
    console.log(summary);
    return summary;
  }
}

//user management
class User {
  constructor(id, name, email, address) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.address = address;
    this.cart = new ShoppingCart();
  }

  //user checkout their cart
  checkout() {
    // creates order from cart items
    const order = {
      userId: this.id,
      items: this.cart.getItems(),
      totalAmount: this.cart.totalPrice(),
      status: "Processing",
    };
    //console.log(`Order placed successfully for User ID: ${this.id}`);
    console.log(`User ${this.id} placed an order:`, order.items);

    //clear the cart after checkout
    this.cart = new ShoppingCart();
    return order;
  }
}

// orders management
class Order {
  constructor(
    orderId,
    userId,
    items,
    totalAmount,
    status = "Processing",
    date = new Date()
  ) {
    this.orderId = orderId;
    this.userId = userId;
    this.items = items;
    this.totalAmount = totalAmount;
    this.status = status;
    this.date = date;
  }

  //static property to track order count
  static orderCount = 0;

  //update order status
  updateStatus(newStatus) {
    this.status = newStatus;
    console.log(`Order ID: ${this.orderId} status updated to ${this.status}`);
  }

  //get order details
  getOrderDetails() {
    return `Order ID: ${this.orderId}, User ID: ${this.userId}, Items: ${this.items}, Total Amount: $${this.totalAmount}, Status: ${this.status}, Date: ${this.date}`;
  }
}

//Polymorphism

//payment processing
class PaymentMethod {
  processPayment(amount) {
    console.log(`Processing payment of $${amount}`);
  }
}


//implementing card payment
class CreditCardPayment extends PaymentMethod {
  constructor(cardNumber, CSV, expireDate) {
    super();
    this.cardNumber = cardNumber;
    this.CSV = CSV;
    this.expireDate = expireDate;
  }
  processPayment(amount) {
    console.log(`Processing credit card payment of $${amount}`);
  }
}


// implementing paypal payment
class PaypalPayment extends PaymentMethod {
  processPayment(amount){
    console.log(`Processing Paypal payment of $${amount}`);
  }
}

//implementing CryptoPayment
class CryptoPayment extends PaymentMethod {
  processPayment(amount) {
        console.log(`Processing Crypto payment of $${amount}`);

  }
}

//example usage
const laptop = new ElectronicsProduct(1, "Laptop", 1200, 10, 24);
const tshirt = new ClothingProduct(2, "T-Shirt", 20, 50, "L", "Red");

const user = new User(1, "John Doe", "john.doe@example.com", "123 Main St");
user.cart.addItem(laptop, 1);
user.cart.addItem(tshirt, 2);
const order = user.checkout();
const orderInstance = new Order(
  ++Order.orderCount,
  order.userId,
  order.items,
  order.totalAmount
);
const payment = new CreditCardPayment('1234 5678 9098 7654', '123', '11/11')
payment.processPayment(order.totalAmount)
orderInstance.updateStatus("Shipped");
console.log(orderInstance.getOrderDetails());

const user2 = new User(2, "Jane Smith", "jane.smith@example.com", "456 Elm St");
user2.cart.addItem(tshirt, 5);
user2.cart.addItem(laptop, 2);
const order2 = user2.checkout();
const payment2 = new CryptoPayment()
payment2.processPayment(order2.totalAmount)
const orderInstance2 = new Order(
  ++Order.orderCount,
  order2.userId,
  order2.items,
  order2.totalAmount
);
orderInstance2.updateStatus("Delivered");
console.log(orderInstance2.getOrderDetails());
