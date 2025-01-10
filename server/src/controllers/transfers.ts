import { RequestHandler } from "express";
import TransferModel from "../models/transfer";
import createHttpError from "http-errors";
import mongoose from "mongoose";

/*
view Group Transfers
*/
export const getGroupTransfers: RequestHandler = async (req, res, next) => {
  try {
    const transfers = await TransferModel.find({
      groupId: req.params.groupId,
    }).exec();
    res.status(200).json(transfers);
  } catch (error) {
    next(error);
  }
};

export const getTransfer: RequestHandler = async (req, res, next) => {
  const transferId = req.params.transferId;
  try {
    if (!mongoose.isValidObjectId(transferId)) {
      throw createHttpError(400, "Invalid transfer id");
    }
    const transfer = await TransferModel.findById(transferId).exec();

    if (!transfer) {
      throw createHttpError(404, "Transfer not found");
    }
    res.status(200).json(transfer);
  } catch (error) {
    next(error);
  }
};

interface createTransferParams {
  groupId: string;
}
interface createTransferBody {
  from?: string;
  to?: number;
  date?: string;
  amount?: number;
}

export const createTransfer: RequestHandler<
  createTransferParams,
  unknown,
  createTransferBody,
  unknown
> = async (req, res, next) => {
  const groupId = req.params.groupId;
  const from = req.body.from;
  const to = req.body.to;
  const date = req.body.date;
  const amount = req.body.amount;

  try {
    if (!mongoose.isValidObjectId(groupId))
      throw createHttpError(400, "Invalid group Id");
    if (!from || !to || !date || !amount)
      throw createHttpError(400, "No required transfer parameters");

    const newTransfer = await TransferModel.create({
      groupId: groupId,
      from: from,
      to: to,
      date: date,
      amount: amount,
    });

    //TODO: Update balances in group model

    res.status(201).json(newTransfer);
  } catch (error) {
    next(error);
  }
};

interface updateTransferParams {
  transferId: string;
}
interface updateTransferBody {
  from?: string;
  to?: string;
  date?: string;
  amount?: number;
}
export const updateTransfer: RequestHandler<
  updateTransferParams,
  unknown,
  updateTransferBody,
  unknown
> = async (req, res, next) => {
  const transferId = req.params.transferId;
  const from = req.body.from;
  const to = req.body.to;
  const date = req.body.date;
  const amount = req.body.amount;
  try {
    if (!mongoose.isValidObjectId(transferId))
      throw createHttpError(400, "Invalid transfer Id");
    if (!from || !to || !date || !amount)
      throw createHttpError(400, "No required transfer parameters");

    const transfer = await TransferModel.findById(transferId).exec();
    if (!transfer) throw createHttpError(404, "Transfer not found");

    // const groupId = transfer.groupId;
    transfer.from = from;
    transfer.to = to;
    transfer.date = date;
    transfer.amount = amount;

    //TODO: Update balances in group model
    const updatedTransfer = await transfer.save();

    res.status(201).json(updatedTransfer);
  } catch (error) {
    next(error);
  }
};

export const deleteTransfer: RequestHandler = async (req, res, next) => {
  const transferId = req.params.transferId;

  try {
    if (!mongoose.isValidObjectId(transferId))
      throw createHttpError(400, "Invalid transfer Id");

    const transfer = await TransferModel.findById(transferId).exec();
    if (!transfer) throw createHttpError(404, "Transfer not found");

    //TODO: update group balances
    await TransferModel.deleteOne({_id: transferId})
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
