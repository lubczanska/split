import { Expense } from "../models/expense";
import { User } from "../models/user";

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

//Users Api
export async function getLoggedInUser(): Promise<User> {
  const response = await fetchData("http://localhost:5000/api/users", {
    method: "GET",
    credentials: "include",
  });
  return response.json();
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
  fullname: string;
  bio: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await fetchData("http://localhost:5000/api/users/signup", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export interface LogInCredentials {
  username: string;
  password: string;
}

export async function logIn(credentials: LogInCredentials): Promise<User> {
  const response = await fetchData("http://localhost:5000/api/users/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function logOut() {
  await fetchData("http://localhost:5000/api/users/logout", {
    method: "POST",
    credentials: "include",
  });
}
// Expenses Api
export async function fetchExpenses(): Promise<Expense[]> {
  const response = await fetchData("http://localhost:5000/api/expenses", {
    method: "GET",
    credentials: "include",
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
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });
  return response.json();
}

export async function updateExpense(
  expenseId: string,
  expense: ExpenseInput
): Promise<Expense> {
  const response = await fetchData(
    "http://localhost:5000/api/expenses/" + expenseId,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    }
  );
  return response.json();
}

export async function deleteExpense(expenseId: string) {
  await fetchData("http://localhost:5000/api/expenses/" + expenseId, {
    method: "DELETE",
    credentials: "include",
  });
}
