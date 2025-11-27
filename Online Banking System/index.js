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
    if (0 <= amount <= this.#balance) {
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
    this.type = type;
    this.amount = amount;
    this.description = description;

    this.#transactionsHistory.push({ type, amount, description });
    //console.log(this.#transactionsHistory)
  }

  getTransactionHistory() {
    console.log(this.#transactionsHistory);
    return this.#transactionsHistory;
  }

  //interest rate
  #interestRate(){
    return 20
  }

  calculateInterest(time) {
    const interest = (this.#balance * this.#interestRate() * time)/1200;
    console.log(`Interest accured in ${time} months: $${interest}`);
    return interest;
  }



}

const acct1 = new Account(12345679809, "tolu");
const acct2 = new Account(5555555555, "titus");
acct1.deposit(1000);
acct1.calculateInterest(10);
//acct1.withdraw(500);
//acct1.transfer(acct2, 400);
//acct1.getTransactionHistory();
//acct2.getTransactionHistory()
