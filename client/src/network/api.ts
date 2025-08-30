import { Expense } from "../models/expense";
import { User } from "../models/user";
import { Group } from "../models/group";
import configData from "./../config.json";

async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
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
  const response = await fetchData(configData.SITE_URL + "/api/users/", {
    method: "GET",
    credentials: "include",
  });
  return response.json();
}

export async function fetchUser(userId: string): Promise<User> {
  const response = await fetchData(
    configData.SITE_URL + "/api/users" + userId,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return response.json();
}

// unused for now
export async function getUserOwed(): Promise<number> {
  const response = await fetchData(configData.SITE_URL + "/api/users/owed", {
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
  const response = await fetchData(configData.SITE_URL + "/api/users/signup", {
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
  const response = await fetchData(configData.SITE_URL + "/api/users/login", {
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
  await fetchData(configData.SITE_URL + "/api/users/logout", {
    method: "POST",
    credentials: "include",
  });
}

// Groups Api
export async function fetchGroup(groupId: string): Promise<Group> {
  const response = await fetchData(
    configData.SITE_URL + "/api/groups/" + groupId,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return response.json();
}
export async function fetchGroups(): Promise<Group[]> {
  const response = await fetchData(configData.SITE_URL + "/api/groups", {
    method: "GET",
    credentials: "include",
  });
  return response.json();
}

export interface GroupInput {
  name: string;
  emoji: string;
  currency: string;
  members: { name: string; id?: string }[];
}

export async function createGroup(group: GroupInput): Promise<Group> {
  const response = await fetchData(configData.SITE_URL + "/api/groups", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(group),
  });
  return response.json();
}

export async function updateGroup(
  groupId: string,
  group: GroupInput
): Promise<Group> {
  const response = await fetchData(
    configData.SITE_URL + "/api/groups/" + groupId,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(group),
    }
  );
  return response.json();
}

export async function deleteGroup(groupId: string) {
  await fetchData(configData.SITE_URL + "/api/groups/" + groupId, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function leaveGroup(groupId: string, username: string) {
  await fetchData(configData.SITE_URL + "/api/groups/leave/" + groupId, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: username }),
  });
}

export async function joinGroup(
  groupId: string,
  username: string,
  name: string
) {
  await fetchData(configData.SITE_URL + "/api/groups/join/" + groupId, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: username, name: name }),
  });
}

export async function fetchGroupSettlement(
  groupId: string
): Promise<[string, string, number][]> {
  const response = await fetchData(
    configData.SITE_URL + "/api/groups/balance/" + groupId,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return response.json();
}

// Expenses Api
export async function fetchGroupExpenses(groupId: string): Promise<Expense[]> {
  const response = await fetchData(
    configData.SITE_URL + "/api/expenses/view/" + groupId,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return response.json();
}

export interface ExpenseInput {
  name: string;
  amount: number;
  date: string;
  category: string;
  paidBy: string;
  members: string[];
  costSplit: Record<string, number>;
}

export async function createExpense(
  groupId: string,
  expense: ExpenseInput
): Promise<Expense> {
  const response = await fetchData(
    configData.SITE_URL + "/api/expenses/" + groupId + "/addExpense",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    }
  );
  return response.json();
}

export interface TransferInput {
  from: string;
  to: string;
  date: string;
  amount: string;
}

export async function createTransfer(
  groupId: string,
  transfer: TransferInput
): Promise<Expense> {
  const split = new Map();
  split.set(transfer.to, transfer.amount);
  const expense = {
    name: "Transfer",
    amount: transfer.amount,
    date: transfer.date,
    category: "Transfer",
    paidBy: transfer.from,
    members: [transfer.to],
    costSplit: split,
  };
  const response = await fetchData(
    configData.SITE_URL + "/api/expenses/" + groupId + "/addExpense",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    }
  );
  return response.json();
}

export async function updateExpense(
  expenseId: string,
  expense: ExpenseInput
): Promise<Expense> {
  const response = await fetchData(
    configData.SITE_URL + "/api/expenses/" + expenseId,
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
  await fetchData(configData.SITE_URL + "/api/expenses/" + expenseId, {
    method: "DELETE",
    credentials: "include",
  });
}

// Other

export async function fetchGroupTotal(groupId: string): Promise<number> {
  const response = await fetchData(
    configData.SITE_URL + "/api/groups/total/" + groupId,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return response.json();
}

export async function getGroupCategoryTotal(
  groupId: string
): Promise<[string, number][]> {
  const response = await fetchData(
    configData.SITE_URL + "/api/groups/categoryTotal/" + groupId,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return response.json();
}
export async function getGroupUserTotal(
  groupId: string
): Promise<[string, number][]> {
  const response = await fetchData(
    configData.SITE_URL + "/api/groups/userTotal/" + groupId,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return response.json();
}
