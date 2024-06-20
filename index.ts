#! /usr/bin/env node

import inquirer from "inquirer";

import chalk from "chalk";

console.log(chalk.bold.bgGreenBright("Welcome to Yashwa Bank Application."));

class Account {
  private static accountCounter: number = 43210;
  public accountNumber: string;
  public balance: number;

  constructor(public name: string, initialDeposit: number) {
    this.accountNumber = this.generateAccountNumber();
    this.balance = initialDeposit;
  }

  private generateAccountNumber(): string {
    return (Account.accountCounter++).toString().padStart(5, '0');
  }

  public deposit(amount: number): void {
    this.balance += amount;
    console.log(chalk.green(`Deposited $${amount} successfully!`));
  }

  public withdraw(amount: number): void {
    if (amount <= this.balance) {
      this.balance -= amount;
      console.log(chalk.green(`Withdrew $${amount} successfully!`));
    } else {
      console.log(chalk.red(`Insufficient balance to withdraw $${amount}.`));
    }
  }

  public viewBalance(): void {
    console.log(chalk.blue(`Your current balance is $${this.balance}.`));
  }

  public showDetails(): void {
    console.log(chalk.yellow(`Name: ${this.name}`));
    console.log(chalk.yellow(`Account Number: ${this.accountNumber}`));
    console.log(chalk.yellow(`Balance: $${this.balance}`));
  }
}

class YashwaBankManagementSystem {
  private accounts: Account[] = [];

  public async start(): Promise<void> {
    let exit = false;
    while (!exit) {
      const { action } = await inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'Choose an option:',
        choices: ['Create Account', 'Deposit', 'Withdraw', 'View Balance', 'Show Details', chalk.redBright('Exit')]
      });

      switch (action) {
        case 'Create Account':
          await this.createAccount();
          break;
        case 'Deposit':
          await this.deposit();
          break;
        case 'Withdraw':
          await this.withdraw();
          break;
        case 'View Balance':
          await this.viewBalance();
          break;
        case 'Show Details':
          await this.showDetails();
          break;
        case chalk.redBright('Exit'):
          console.log(chalk.italic.bgBlackBright("Thanks for using Yashwa Bank."));
          exit = true;
          break;
      }
    }
  }

  private async createAccount(): Promise<void> {
    const { name, initialDeposit } = await inquirer.prompt([
      {
        name: 'name',
        type: 'input',
        message: 'Enter account holder name:'
      },
      {
        name: 'initialDeposit',
        type: 'number',
        message: 'Enter initial deposit amount:'
      }
    ]);

    const account = new Account(name, initialDeposit);
    this.accounts.push(account);
    console.log(chalk.green(`Account created for ${name} with Account Number ${account.accountNumber}`));
  }

  private async selectAccount(): Promise<Account | null> {
    if (this.accounts.length === 0) {
      console.log(chalk.red('No accounts available.'));
      return null;
    }

    const { accountNumber } = await inquirer.prompt({
      name: 'accountNumber',
      type: 'list',
      message: 'Select account:',
      choices: this.accounts.map(account => ({ name: account.name, value: account.accountNumber }))
    });

    return this.accounts.find(account => account.accountNumber === accountNumber) || null;
  }

  private async deposit(): Promise<void> {
    const account = await this.selectAccount();
    if (!account) return;

    const { amount } = await inquirer.prompt({
      name: 'amount',
      type: 'number',
      message: 'Enter amount to deposit:'
    });

    account.deposit(amount);
  }

  private async withdraw(): Promise<void> {
    const account = await this.selectAccount();
    if (!account) return;

    const { amount } = await inquirer.prompt({
      name: 'amount',
      type: 'number',
      message: 'Enter amount to withdraw:'
    });

    account.withdraw(amount);
  }

  private async viewBalance(): Promise<void> {
    const account = await this.selectAccount();
    if (account) {
      account.viewBalance();
    }
  }

  private async showDetails(): Promise<void> {
    const account = await this.selectAccount();
    if (account) {
      account.showDetails();
    }
  }
}

const YashwaBank = new YashwaBankManagementSystem();
YashwaBank.start();