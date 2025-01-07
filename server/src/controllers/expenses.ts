import { RequestHandler } from "express";
import ExpenseModel from "../models/expense";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getExpenses: RequestHandler = async (req, res, next) => {
  try {
    const expenses = await ExpenseModel.find().exec();
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
};

export const getExpense: RequestHandler = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  try {
    if (!mongoose.isValidObjectId(expenseId)) {
      throw createHttpError(400, "invalid expense id");
    }
    const expense = await ExpenseModel.findById(expenseId).exec();

    if (!expense) {
      throw createHttpError(404, "exoense not found");
    }
    res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
};

interface createExpenseBody {
  groupId: string;
  name: string;
  amount: number;
  owner: string;
  members: Array<string>;
  expensePerMember: Array<string>;
  // TODO: add not required fields
}

export const createExpense: RequestHandler<
  unknown,
  unknown,
  createExpenseBody,
  unknown
> = async (req, res, next) => {
  const name = req.body.name;
  const groupId = req.body.groupId;
  const amount = req.body.amount;
  const owner = req.body.owner;
  const members = req.body.members;
  const expensePerMember = req.body.expensePerMember;

  try {
    if (!name || !groupId || !amount || !owner || !members || !expensePerMember)
      throw createHttpError(400, "No required expense parameters");

    const newExpense = await ExpenseModel.create({
      groupId: groupId,
      name: name,
      amount: amount,
      owner: owner,
      members: members,
      expensePerMember: expensePerMember,
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
  groupId?: string;
  name?: string;
  amount?: number;
  owner?: string;
  members?: Array<string>;
  expensePerMember?: Array<string>;
  // TODO: add not required fields
}

export const updateExpense: RequestHandler<
  updateExpenseParams,
  unknown,
  updateExpenseBody,
  unknown
> = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  const name = req.body.name;
  const groupId = req.body.groupId;
  const amount = req.body.amount;
  const owner = req.body.owner;
  const members = req.body.members;
  const expensePerMember = req.body.expensePerMember;
  try {
    if (!mongoose.isValidObjectId(expenseId))
      throw createHttpError(400, "invalid expense id");
    if (!name || !groupId || !amount || !owner || !members || !expensePerMember)
      throw createHttpError(400, "No required expense parameters");

    const expense = await ExpenseModel.findById(expenseId).exec();
    if (!expense) {
      throw createHttpError(404, "exoense not found");
    }
    expense.name = name;
    expense.amount = amount;
    expense.owner = owner;
    expense.members = members;
    expense.expensePerMember = expensePerMember;
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
    const expense = await ExpenseModel.findById(expenseId).exec();
    if (!expense) {
      throw createHttpError(404, "exoense not found");
    }

    await ExpenseModel.deleteOne({
      _id: expenseId,
    });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
