import { RequestHandler } from "express";
import ExpenseModel from "../models/expense";
import GroupModel from "../models/group";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { round2 } from "../util/round2";

/*
view Group Transfers and Expenses
*/
export const getGroupExpenses: RequestHandler = async (req, res, next) => {
  const groupId = req.params.groupId;
  try {
    const expenses = await ExpenseModel.find({ groupId: groupId })
      .sort({ date: -1 })
      .exec();
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
};

export const getExpense: RequestHandler = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  try {
    if (!mongoose.isValidObjectId(expenseId)) {
      throw createHttpError(400, "Invalid expense id");
    }
    const expense = await ExpenseModel.findById(expenseId).exec();

    if (!expense) {
      throw createHttpError(404, "Expense not found");
    }
    res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
};

interface createExpenseParams {
  groupId: string;
}
interface createExpenseBody {
  name?: string;
  amount?: number;
  date?: string;
  category?: string;
  paidBy?: string;
  members: string[];
  costSplit: Map<string, number>;
}

/*
Add expense to Group Member Balance 
*/
const updateBalances = async (
  groupId: string,
  paidBy: string,
  amount: number,
  members: string[],
  split: Map<string, number>
) => {
  const group = await GroupModel.findById(groupId).exec();
  if (!group) throw createHttpError(404, "No group");

  members.forEach((member) => {
    group.memberBalance.set(
      member,
      round2(
        Number(group.memberBalance.get(member)) - Number(split.get(member))
      )
    );
  });
  group.memberBalance.set(
    paidBy,
    round2(Number(group.memberBalance.get(paidBy)) + amount)
  );
  group.save();
};

/*
Remove expense from Group Member Balance 
*/
const clearBalances = async (
  groupId: string,
  paidBy: string,
  amount: number,
  members: Array<string>,
  split: Map<string, number>
) => {
  const group = await GroupModel.findById(groupId).exec();
  if (!group) throw createHttpError(404, "No group");

  members.forEach((member) => {
    group.memberBalance.set(
      member,
      round2(
        Number(group.memberBalance.get(member)) + Number(split.get(member))
      )
    );
  });
  group.memberBalance.set(
    paidBy,
    round2(Number(group.memberBalance.get(paidBy)) - amount)
  );

  group.save();
};

export const createExpense: RequestHandler<
  createExpenseParams,
  unknown,
  createExpenseBody,
  unknown
> = async (req, res, next) => {
  const groupId = req.params.groupId;

  const name = req.body.name;
  const amount = req.body.amount;
  const date = req.body.date;
  const paidBy = req.body.paidBy;
  const members = req.body.members;
  const costSplit = req.body.costSplit;
  const category = req.body.category;

  try {
    if (!mongoose.isValidObjectId(groupId)) {
      throw createHttpError(400, "Invalid group Id");
    }
    if (!name || !amount || !date || !paidBy || !members || !costSplit)
      throw createHttpError(400, "No required expense parameters");

    // do individual amounts sum to amount?
    // const sum = Object.values(costSplit).reduce((acc, x) => acc + x, 0);
    // if (sum != amount)
    //   //what about rounding
    //   throw createHttpError(
    //     400,
    //     "Indvidual amounts don't sum to expense amount"
    //   );

    const split = new Map(Object.entries(costSplit));
    await updateBalances(groupId, paidBy, amount, members, split);

    const newExpense = await ExpenseModel.create({
      name: name,
      amount: amount,
      groupId: groupId,
      members: members,
      date: date,
      paidBy: paidBy,
      costSplit: costSplit,
      category: category,
    });

    res.status(201).json(newExpense);
  } catch (error) {
    next(error);
  }
};

interface updateExpenseParams {
  expenseId: string;
}

interface updateExpenseBody {
  name?: string;
  amount?: number;
  date?: string;
  category?: string;
  paidBy?: string;
  members: Array<string>;
  costSplit: Map<string, number>;
}

export const updateExpense: RequestHandler<
  updateExpenseParams,
  unknown,
  updateExpenseBody,
  unknown
> = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  const name = req.body.name;
  // const groupId = req.body.groupId;
  const amount = req.body.amount;
  const date = req.body.date;
  const members = req.body.members;
  const costSplit = req.body.costSplit;
  const paidBy = req.body.paidBy;

  try {
    if (!mongoose.isValidObjectId(expenseId))
      throw createHttpError(400, "invalid expense id");
    if (!name || !amount || !date || !paidBy || !members || !costSplit)
      throw createHttpError(400, "No required expense parameters");

    const expense = await ExpenseModel.findById(expenseId).exec();
    if (!expense) {
      throw createHttpError(404, "Expense not found");
    }

    const groupId = expense.groupId.toString();
    clearBalances(
      groupId,
      expense.paidBy,
      expense.amount,
      expense.members,
      expense.costSplit
    );
    updateBalances(groupId, paidBy, amount, members, costSplit);

    expense.name = name;
    expense.amount = amount;
    expense.date = date;
    expense.members = members;
    expense.costSplit = costSplit;
    expense.paidBy = paidBy;
    const updatedExpense = await expense.save();

    res.status(200).json(updatedExpense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense: RequestHandler = async (req, res, next) => {
  const expenseId = req.params.expenseId;

  try {
    if (!mongoose.isValidObjectId(expenseId))
      throw createHttpError(400, "invalid expense id");
    const expense = await ExpenseModel.findOne({ _id: expenseId }).exec();
    if (!expense) {
      throw createHttpError(404, "exoense not found");
    }

    await ExpenseModel.deleteOne({
      _id: expenseId,
    });

    await clearBalances(
      expense.groupId.toString(),
      expense.paidBy,
      expense.amount,
      expense.members,
      expense.costSplit
    );
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
