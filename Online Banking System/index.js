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
    if (amount <= 0) {
      console.log("Deposited amount must be greater than 0");
      return;
    }

    if (amount >= 0) {
      this.#balance += amount;
      //console.log(`Deposited: $${amount}. New Balance: $${this.#balance}`);
      this.#recordtransaction(
        "deposit",
        amount,
        `${this.accountHolder} deposited`
      );
    }
  }

  withdraw(amount) {
    if (amount <= 0) {
      console.log("Amount must be greater than 0");
      return;
    }

    if (amount > this.#balance) {
      console.log("Warning: withdrawing more than balance!");
      this.#balance -= amount; // allows negative balance
    } else {
      this.#balance -= amount;
    }

    if (amount <= this.#balance) {
      this.#balance -= amount;
      //console.log(`Withdrew: $${amount}. New Balance: $${this.#balance}`);
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
    initialBalance,
    interestRate = 0.3,
    minimumBalance = 100
  ) {
    super(accountNumber, accountHolder, initialBalance);
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
    overdraftLimit = 500
  ) {
    super(accountNumber, accountHolder, initialBalance);
    this.overdraftLimit = overdraftLimit;
  }

  //Overriding withdraw method
  withdraw(amount) {
    if (amount > this.getBalance() + this.overdraftLimit) {
      console.log("Withdrawal exceeds overdraft limit.");
      return;
    }
    super.withdraw(amount); //call parent class withdraw method
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
    riskLevel = "medium",
    holdings = { stocks: [] }
  ) {
    super(accountNumber, accountHolder, initialBalance);
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
    this.customerId = this.generateId();
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.accounts = [];
    this.#pin = Math.floor(1000 + Math.random() * 9000); //generate a 4 digit pin
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

  //generate unique customer ID
  generateId() {
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
  }

  //add account to customer
  addAccount(account) {
    this.accounts.push(account);
    console.log(
      `Account number ${account.accountNumber} is been added to the accounts of customer with customer ID: ${this.customerId}`
    );
  }

  //get total balance
  getTotalBalance() {
    let totalBalance = 0;
    this.accounts.forEach((acct) => {
      const balance = acct.getBalance();
      totalBalance += balance;
    });
    console.log(totalBalance);
    return totalBalance;
  }

  //customer profile info
  getCustomerInfo() {
    return {
      cusutomerName: this.name,
      totalBalance: this.getTotalBalance(),
      NumOfAccounts: this.accounts.Accounts.length,
    };
  }
}

// const acct1 = new InvestmentAccount(12345679809, "tolu");
// const acct2 = new Account(5555555555, "titus");
// acct1.deposit(10000);
// acct1.riskLevel = "low";
// //acct1.calculateInterest(8);
// // acct1.withdraw(500);
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
const customer1 = new Customer(
  1,
  "Tolu Ade",
  "toluAde@example.com",
  "123-456-7890",
  "123 Main St"
);
const savingsAcct = new SavingsAccount(1001, customer1.name, 5000);
const checkingAcct = new CheckingAccount(1002, customer1.name, 2000);
customer1.addAccount(savingsAcct);
customer1.addAccount(checkingAcct);
savingsAcct.deposit(1500);
checkingAcct.withdraw(2500); //within overdraft limit
checkingAcct.getAvailableBalanceToOverdraft();
customer1.getTotalBalance();
