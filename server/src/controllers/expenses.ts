import { RequestHandler } from "express";
import ExpenseModel from "../models/expense";
import GroupModel from "../models/group";
import createHttpError from "http-errors";
import mongoose from "mongoose";

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
      Math.round(
        (Number(group.memberBalance.get(member)) -
          Number(split.get(member)) +
          Number.EPSILON) *
          100
      ) / 100
    );
  });
  group.memberBalance.set(
    paidBy,
    Math.round(
      (Number(group.memberBalance.get(paidBy)) + amount + Number.EPSILON) * 100
    ) / 100
  );
  group.save();
};

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
      Number(group.memberBalance.get(member)) + Number(split.get(member))
    );
  });
  group.memberBalance.set(
    paidBy,
    Number(group.memberBalance.get(paidBy)) - amount
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

    const split = new Map(Object.entries(costSplit));
    // TODO: fix equal splits
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
      throw createHttpError(404, "expense not found");
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

// export const getTransfer: RequestHandler = async (req, res, next) => {
//   const transferId = req.params.transferId;
//   try {
//     if (!mongoose.isValidObjectId(transferId)) {
//       throw createHttpError(400, "Invalid transfer id");
//     }
//     const transfer = await TransferModel.findById(transferId).exec();

//     if (!transfer) {
//       throw createHttpError(404, "Transfer not found");
//     }
//     res.status(200).json(transfer);
//   } catch (error) {
//     next(error);
//   }
// };

// interface createTransferBody {
//   from?: string;
//   to?: number;
//   date?: string;
//   amount?: number;
// }

// export const createTransfer: RequestHandler<
//   createTransferParams,
//   unknown,
//   createTransferBody,
//   unknown
// > = async (req, res, next) => {
//   const groupId = req.params.groupId;
//   const from = req.body.from;
//   const to = req.body.to;
//   const date = req.body.date;
//   const amount = req.body.amount;

//   try {
//     if (!mongoose.isValidObjectId(groupId))
//       throw createHttpError(400, "Invalid group Id");
//     if (!from || !to || !date || !amount)
//       throw createHttpError(400, "No required transfer parameters");

//     const newTransfer = await ExpenseModel.create({
//       groupId: groupId,
//       from: from,
//       to: to,
//       date: date,
//       amount: amount,
//     });

//     //TODO: Update balances in group model

//     res.status(201).json(newTransfer);
//   } catch (error) {
//     next(error);
//   }
// };

// interface updateTransferParams {
//   transferId: string;
// }
// interface updateTransferBody {
//   from?: string;
//   to?: string;
//   date?: string;
//   amount?: number;
// }
// export const updateTransfer: RequestHandler<
//   updateTransferParams,
//   unknown,
//   updateTransferBody,
//   unknown
// > = async (req, res, next) => {
//   const transferId = req.params.transferId;
//   const from = req.body.from;
//   const to = req.body.to;
//   const date = req.body.date;
//   const amount = req.body.amount;
//   try {
//     if (!mongoose.isValidObjectId(transferId))
//       throw createHttpError(400, "Invalid transfer Id");
//     if (!from || !to || !date || !amount)
//       throw createHttpError(400, "No required transfer parameters");

//     const transfer = await TransferModel.findById(transferId).exec();
//     if (!transfer) throw createHttpError(404, "Transfer not found");

//     // const groupId = transfer.groupId;
//     transfer.from = from;
//     transfer.to = to;
//     transfer.date = date;
//     transfer.amount = amount;

//     //TODO: Update balances in group model
//     const updatedTransfer = await transfer.save();

//     res.status(201).json(updatedTransfer);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteTransfer: RequestHandler = async (req, res, next) => {
//   const transferId = req.params.transferId;

//   try {
//     if (!mongoose.isValidObjectId(transferId))
//       throw createHttpError(400, "Invalid transfer Id");

//     const transfer = await TransferModel.findById(transferId).exec();
//     if (!transfer) throw createHttpError(404, "Transfer not found");

//     //TODO: update group balances
//     await TransferModel.deleteOne({ _id: transferId });
//     res.sendStatus(204);
//   } catch (error) {
//     next(error);
//   }
// };
