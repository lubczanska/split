export interface Expense {
  _id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
  paidBy: string;
  members: string[];
  costSplit: Map<string, number>;
}
