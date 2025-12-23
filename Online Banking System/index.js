//online banking system

//Account Hirerarchy
class Account {
  #balance;
  #transactionsHistory = [];
  constructor(accountNumber, accountHolder, initialBalance = 0) {
    this.accountNumber = accountNumber;
    this.accountHolder = accountHolder;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    //check whether amount is valid that is greater than 0
    if (amount < 0) {
      console.log("Deposited amount must be greater than 0");
      return;
    }

    //proceed to deposit
    this.#balance += amount;
    //console.log(`Deposited: $${amount}. New Balance: $${this.#balance}`);
    this.#recordtransaction(
      "deposit",
      amount,
      `${this.accountHolder} deposited`
    );
  }

  withdraw(amount) {
    //check whether amount is valid that is greater than 0
    if (amount < 0) {
      console.log("Amount must be greater than 0");
      return;
    }

    //check whether amount is greater than balance
    if (amount > this.#balance) {
      console.log("Warning: Insufficient funds!");
      return;
    }

    if (amount <= this.#balance) {
      this.#balance -= amount;
      console.log(`Withdrew: $${amount}. New Balance: $${this.#balance}`);
      this.#recordtransaction(
        "withdrawal",
        amount,
        `${this.accountHolder} withdrew`
      );
    }
  }

  getBalance() {
    console.log(`Current Balance: $${this.#balance}`);
    return this.#balance;
  }

  adjustBalance(amount) {
    this.#balance += amount;
  }

  setBalance(newBalance) {
    this.#balance = newBalance;
    console.log(`Current Balance + Overdraft: $${this.#balance}`);
  }

  transfer(targetAccount, amount) {
    //check if target account exists
    if (!targetAccount) {
      console.log("target account does not exist");
      return;
    }
    if (amount > this.#balance) {
      console.log("insufficient funds");
      return;
    }

    if (amount > 0) {
      this.withdraw(amount);
      targetAccount.deposit(amount);
      //console.log(`Transferred: $${amount} to Account No: ${targetAccount.accountNumber}`);
      this.#recordtransaction(
        "transfer",
        amount,
        `Transferred to Account No: ${targetAccount.accountNumber}`
      );
    }
  }

  #recordtransaction(type, amount, description) {
    this.#transactionsHistory.push({ type, amount, description });
    //console.log(this.#transactionsHistory)
  }

  recordTransaction(type, amount, description) {
    this.#transactionsHistory.push(type, amount, description);
  }

  getTransactionHistory() {
    console.log(this.#transactionsHistory);
    return this.#transactionsHistory;
  }

  //interest rate
  #interestRate() {
    return 0.25; //25% annual interest rate
  }

  calculateInterest(timeInMonths) {
    const interest = (this.#balance * this.#interestRate() * timeInMonths) / 12;
    console.log(`Interest accured in ${timeInMonths} months: $${interest}`);
    return interest;
  }
}

//Diffrent types of Account attached to Account class

class SavingsAccount extends Account {
  constructor(
    accountNumber,
    accountHolder,
    initialDeposit,
    accountType = "savings",
    interestRate = 0.3,
    minimumBalance = 100
  ){
    if (initialDeposit < minimumBalance) {  
      throw new Error(`Initail deposit must be at least $${minimumBalance}`)
  } 
    super(accountNumber, accountHolder, initialDeposit);
    this.accountType = accountType;
    this.interestRate = interestRate;
    this.minimumBalance = minimumBalance;
  }

  //Overriding withdraw method
  withdraw(amount) {
    //make sure minimum balance is maintained
    if (this.getBalance() - amount < this.minimumBalance) {
      // get balance from parent class then check if the withdraw will go below minimum balance
      console.log(
        `Cannot withdraw. Minimum balance of $${this.minimumBalance} must be maintained.`
      );
      return;
    }
    super.withdraw(amount); //call parent class withdraw method
  }

  //Overriding interest rate method
  #interestRate() {
    return this.interestRate;
  }

  calculateInterest(timeInMonths) {
    const interest =
      (this.getBalance() * this.interestRate * timeInMonths) / 12;
    console.log(`Interest accured in ${timeInMonths} months: $${interest}`);
    return interest;
  }
}

//Checking Account
class CheckingAccount extends Account {
  constructor(
    accountNumber,
    accountHolder,
    initialBalance,
    accountType='checkings',
    overdraftLimit = 500
  ) {
    super(accountNumber, accountHolder, initialBalance);
    this.accountType = accountType;
    this.overdraftLimit = overdraftLimit;
  }

  //Overriding withdraw method
  // my solution
  // withdraw(amount) {
  //   const availableBalance = this.getBalance() + this.overdraftLimit;
  //   this.setBalance(availableBalance)
  //   if (amount > availableBalance) {
  //     console.log("Withdrawal exceeds overdraft limit. Available balance: $"+availableBalance);
  //     return;
  //   }
  //   if (amount <= this.getBalance())  {
  //     super.withdraw(amount);
  //     }
  //   }

  withdraw(amount) {
    const realBalance = this.getBalance();
    const availableBalance = realBalance + this.overdraftLimit;

    // 1. Validate amount
    if (amount <= 0) {
      console.log("Amount must be greater than 0");
      return;
    }

    // 2. Check overdraft limit
    if (amount > availableBalance) {
      console.log(
        `Withdrawal exceeds overdraft limit. Available balance: $${availableBalance}`
      );
      return;
    }

    // 3. Deduct the amount (balance may go negative)
    this.setBalance(realBalance - amount);

    // 4. Record the transaction
    this.recordTransaction(
      "withdrawal",
      amount,
      `${this.accountHolder} withdrew (overdraft allowed)`
    );

    console.log(`Withdrew: $${amount}. New Balance: $${this.getBalance()}`);
  }

  //calculate interest method
  calculateInterest(timeInMonths) {
    console.log("Checking accounts do not accrue interest.");
    return 0;
  }

  //Available overdraft
  getAvailableBalanceToOverdraft() {
    console.log(
      `Available balance including overdraft: $${
        this.getBalance() + this.overdraftLimit
      }`
    );
    return this.getBalance() + this.overdraftLimit;
  }
}

//investment account
class InvestmentAccount extends Account {
  constructor(
    accountNumber,
    accountHolder,
    initialBalance,
    accountType = "investment",
    riskLevel = "medium",
    holdings = { stocks: [] }
  ) {
    super(accountNumber, accountHolder, initialBalance);
    this.accountType = accountType;
    this.riskLevel = riskLevel;
    this.holdings = holdings;
  }

  #interestRate() {
    switch (this.riskLevel) {
      case "low":
        return 0.2; //20%
      case "medium":
        return 0.35; //35%
      case "high":
        return 0.5; //50%
      default:
        return 0.25; //default 25%
    }
  }

  //implementing interest
  calculateInterest(timeInMonths) {
    const interest =
      (this.getBalance() * this.#interestRate() * timeInMonths) / 12;
    console.log(`Interest accured in ${timeInMonths} months: $${interest}`);
    return interest;
  }

  //buystocks
  buyStocks(stockName, shares, pricePerShare) {
    const totalCost = shares * pricePerShare;
    if (totalCost > this.getBalance()) {
      //check if sufficient funds are available
      console.log("Insufficient funds to buy stocks.");
      return;
    }
    this.withdraw(totalCost);
    this.holdings.stocks.push({
      name: stockName,
      shares: shares,
      price: pricePerShare,
    });
    console.log(
      `Bought ${shares} shares of ${stockName} at $${pricePerShare} each.`
    );
  }

  //sellstocks
  sellStocks(stockName, shares, pricePerShare) {
    const index = this.holdings.stocks.findIndex(
      (stock) => stock.name === stockName
    );

    if (index === -1) {
      //checks if stock is owned.
      console.log("you don't own this stock");
      return;
    }

    //determine number of shares that can be sold
    //how much shares is available
    const currentShares = this.holdings.stocks[index];

    if (shares > currentShares.shares) {
      console.log(
        `you don't have enough shares to sell. current shares: ${currentShares.shares}`
      );
      return;
    }

    const totalCost = shares * pricePerShare;

    this.deposit(totalCost);
    // remove the sold shares from the owned shares
    currentShares.shares -= shares;
    console.log(
      `Sold ${shares} shares of ${stockName}. Remaining: ${currentShares.shares}`
    );

    //remove stock from the holding if all shares are sold
    if (currentShares === 0) {
      console.log("all shares have been sold");
      this.holdings.stocks.splice(index, 1);
    }
  }

  //getting the total value of my portfolio
  getPortfolioValue() {
    let portfolioValue = 0;
    this.holdings.stocks.forEach((stock) => {
      const stockValue = stock.shares * stock.price;
      //console.log(stock.shares)
      portfolioValue += stockValue;
    });

    console.log(`you portfolio is valued at: $${portfolioValue}`);
    return portfolioValue;
  }
}

//Customer Management
class Customer {
  #pin;
  constructor(customerId, name, email, phone, address) {
    this.customerId = customerId;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.accounts = [];
    this.#pin = Math.floor(1000 + Math.random() * 9000); //generate a 4 digit pin
  }

  //get pin
  get pin() {
    return this.#pin;
  }
  //validate PIN
  validatePIN(inputPIN) {
    return this.#pin === inputPIN;
  }

  //change PIN
  changePIN(oldPIN, newPIN) {
    if (this.validatePIN(oldPIN)) {
      this.#pin = newPIN;
      console.log("PIN changed successfully");
    } else {
      console.log("Invalid old PIN. PIN change failed.");
    }
  }

  //add account to customer
  addAccount(account) {
    this.accounts.push(account);
    console.log(
      `Account number ${account.accountNumber} is been added to the accounts of customer with customer ID: ${this.customerId}`
    );
  }

  //get accounts balance for each account
  getAccountsBalance() {
    const balances = this.accounts.map((acct) => {
      return {
        accountNumber: acct.accountNumber,
        accountType: acct.accountType,
        balance: acct.getBalance(),
      };
    });
    return balances;
  }

  //get total balance
  getTotalBalance() {
    return this.accounts.reduce((sum, acct) => sum + acct.getBalance(), 0);
  }

  //customer profile info
  getCustomerInfo() {
    return {
      customerName: this.name,
      totalBalance: this.getTotalBalance(),
      NumOfAccounts: this.accounts.length,
    };
  }
}

//Bank System Management
class Bank {
  static #instance = null; //  static private property to hold the single instance

  //initialize private fields
  #customers = [];
  #currentCustomer = null; // private fields

  constructor() {
    //  static property to hold the single instance
    if (Bank.#instance) {
      return Bank.#instance; //returns existing instance
    }

    Bank.#instance = this; //store the instance
  }

  static getInstance() {
    if (!Bank.#instance) {
      Bank.#instance = new Bank();
    }
    return Bank.#instance;
  }

  //method to register customers
  registerCustomers(name, email, phone, address, pin) {
    const customerId =
      Date.now().toString() + Math.floor(Math.random() * 1000).toString();

    const newCustomer = new Customer(customerId, name, email, phone, address);
    const defaultPin = newCustomer.pin; //get default pin created

    newCustomer.changePIN(defaultPin, pin); //change default pin

    this.#customers.push(newCustomer); //add new customer to the db.
    console.log("Customer registered:", customerId);
    return newCustomer;
  }

  //login method
  login(customerId, pin) {
    //check customers list to see if customer id exists
    const customer = this.#customers.find((c) => {
      return c.customerId === customerId;
    });

    if (!customer) {
      //if customer is not found
      console.log("Customer does not exist");
      return false;
    }
    // confirm the pin
    if (!customer.validatePIN(pin)) {
      console.log("Incorrect Pin");
      return false;
    }

    this.#currentCustomer = customer; //set current customer
    console.log("Login successful");
    return true;
  }

  //getting the current customer
  getCurrentCustomer() {
    return this.#currentCustomer;
  }

  //generate 10 digits account number
  static generateAccountNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000);
  }

  // create account
  createAccount(accountType, initialDeposit) {
    if (!this.#currentCustomer) {
      //check if customer is logged in
      console.log("Please login to create an account");
      return null;
    }

    const holderName = this.#currentCustomer.name; //get current customer name
    const accountNumber = Bank.generateAccountNumber(); //only the bank class can generate account number

    let newAccount;

    switch (accountType) {
      case "savings":
        newAccount = new SavingsAccount(
          accountNumber,
          holderName,
          initialDeposit
        );
        console.log("New Savings account created");
        return newAccount;
      case "checking":
        newAccount = new CheckingAccount(
          accountNumber,
          holderName,
          initialDeposit
        );
        console.log("New checking account created");
        return newAccount;
      case "investment":
        newAccount = new InvestmentAccount(
          accountNumber,
          holderName,
          initialDeposit
        );
        console.log("New investment account created");
        return newAccount;
      default:
        console.log("Invalid account type");
        return;
    }
  }

  //method to get All customers
  getAllCustomers() {
    return this.#customers;
  }
}

//Utilities

//transaction class
class Transaction {
  static lastId = 0; // shared across all transactions

  constructor(type, amount, description, balanceAfter, date = new Date()) {
    this.id = Transaction.generateId();
    this.type = type;
    this.amount = amount;
    this.date = date;
    this.description = description;
    this.balanceAfter = balanceAfter;
  }

  static generateId() {
    return ++Transaction.lastId; // increments and returns
  }

  getFormattedDate() {
    return this.date.toLocaleString();
  }
}

//validator class
class Validator {
  // Validate email using a basic regex pattern
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone number (Nigerian format example: 11 digits or starts with +234)
  static validatePhone(phone) {
    const phoneRegex = /^(?:\+234|0)\d{10}$/;
    return phoneRegex.test(phone);
  }

  // Validate pin (must be exactly 4 digits)
  static validatePin(pin) {
    const pinRegex = /^\d{4}$/;
    return pinRegex.test(pin);
  }

  // Validate amount (must be a number and must be > 0)
  static validateAmount(amount) {
    return typeof amount === "number" && amount > 0;
  }
}

// export default Validator;
// const acct1 = new CheckingAccount(12345679809, "tolu");
// // const acct2 = new Account(5555555555, newCheckingAccount
// acct1.deposit(1000);
// // acct1.riskLevel = "low";
// // //acct1.calculateInterest(8);
// acct1.withdraw(1390);
// acct1.withdraw(110);
// acct1.getBalance();
// // acct1.transfer(acct2, 400);
// // acct1.getTransactionHistory();
// // acct2.getTransactionHistory()
// acct1.buyStocks("AAPL", 5, 150);
// acct1.buyStocks("GOOGL", 2, 2800);
// acct1.getBalance();
// acct1.getPortfolioValue();
// acct1.sellStocks("AAPL", 2, 155);
// acct1.getPortfolioValue();
// acct1.getBalance();
// acct1.calculateInterest(6);
//create new customer
// const customer1 = new Customer(
//   1,
//   "Tolu Ade",
//   "toluAde@example.com",
//   "123-456-7890",
//   "123 Main St"
// );
// const savingsAcct = new SavingsAccount(1001, customer1.name, 5000);
// const checkingAcct = new CheckingAccount(1002, customer1.name, 2000);
// customer1.addAccount(savingsAcct);
// customer1.addAccount(checkingAcct);
// savingsAcct.deposit(1500);
// checkingAcct.withdraw(2500); //within overdraft limit
// checkingAcct.getAvailableBalanceToOverdraft();
// customer1.getTotalBalance();

// instantiate the bank
const myBank = Bank.getInstance();

//register a new customer
const customer1 = myBank.registerCustomers(
  "Tolu Ade",
  "toluade@example.com",
  "08012345678",
  "Lagos",
  2222
);
//login the customer
const isLoggedIn = myBank.login(customer1.customerId, 2222);

if (isLoggedIn) {
  //create a savings account for the logged in customer
  const mySavings = myBank.createAccount("savings", 500);
  //add account to customer profile
  customer1.addAccount(mySavings);

  //perform some transactions
  mySavings.deposit(200);
  mySavings.withdraw(100);
  mySavings.getBalance();
  mySavings.calculateInterest(6);

  //create a checking account for the logged in customer
  const myChecking = myBank.createAccount("checking", 300);
  //add account to customer profile
  customer1.addAccount(myChecking);

  //perform some transactions
  myChecking.withdraw(600); //within overdraft limit
  myChecking.getAvailableBalanceToOverdraft();
  myChecking.deposit(400);
  myChecking.getBalance();

  //create an investment account for the logged in customer
  const myInvestment = myBank.createAccount("investment", 1000);
  //add account to customer profile
  customer1.addAccount(myInvestment);

  //get current customer info

  const currentCustomer = myBank.getCurrentCustomer();
  //console.log(currentCustomer.getCustomerInfo());
  console.log(currentCustomer.getAccountsBalance());
}