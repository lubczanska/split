import { Expense } from "../models/expense";

async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  console.log(input);
  console.log(init);
  console.log(response);
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMsg = errorBody.error;
    throw Error(errorMsg);
  }
}

export async function fetchExpenses(): Promise<Expense[]> {
  const response = await fetchData("http://localhost:5000/api/expenses", {
    method: "GET",
  });
  return response.json();
}

export interface ExpenseInput {
  name: string;
  amount: number;
}

export async function createExpense(expense: ExpenseInput): Promise<Expense> {
  const response = await fetchData("http://localhost:5000/api/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });
  return response.json();
}

export async function updateExpense(expenseId: string, expense: ExpenseInput): Promise<Expense> {
  const response = await fetchData("http://localhost:5000/api/expenses/" + expenseId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });
  return response.json();
}

export async function deleteExpense(expenseId: string) {
  await fetchData("http://localhost:5000/api/expenses/" + expenseId, {
    method: "DELETE",
  });
}


