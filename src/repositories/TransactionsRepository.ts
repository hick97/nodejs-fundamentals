import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public checkIfOutcomeIsValid(outcome: number): boolean {
    const balance = this.getBalance();

    if (balance.total - outcome < 0) {
      return false;
    }

    return true;
  }

  public getBalance(): Balance {
    const reducer = (accumulator: number, currentValue: number): number =>
      accumulator + currentValue;

    const incomeArray = this.transactions.filter(t => t.type === 'income');
    const outcomeArray = this.transactions.filter(t => t.type === 'outcome');

    const totalIncome = incomeArray.map(i => i.value).reduce(reducer, 0);
    const totalOutcome = outcomeArray.map(o => o.value).reduce(reducer, 0);

    const balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({
      title,
      value,
      type,
    });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
