import { RequestHandler } from "express";
import { assertDefined } from "../util/assertDefined";
import GroupModel from "../models/group";
import ExpenseModel from "../models/expense";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import simplifyTransactions from "../util/balance";

/*
Get suggested transfers to balance debts
*/
export const getSettlements: RequestHandler = async (req, res, next) => {
  const groupId = req.params.groupId;

  try {
    if (!mongoose.isValidObjectId(groupId))
      throw createHttpError(400, "Invalid group id");

    const group = await GroupModel.findById(groupId).exec();

    if (!group) throw createHttpError(404, "Group not found");

    const transfers = simplifyTransactions(group.memberBalance);
    res.status(200).json(transfers);
  } catch (error) {
    next(error);
  }
};

/*
Get all groups logged in user is a member of
Accepts: user ID
Returns: groups info
*/
export const getUserGroups: RequestHandler = async (req, res, next) => {
  const userId = req.session.userId;
  try {
    assertDefined(userId);
    const groups = await GroupModel.find({ owner: userId }).exec();
    res.status(200).json(groups);
  } catch (error) {
    next(error);
  }
};

/*
View group details
Accepts: group ID, user ID
Returns: group info
*/
export const getGroup: RequestHandler = async (req, res, next) => {
  const groupId = req.params.groupId;
  const userId = req.session.userId;
  try {
    if (!mongoose.isValidObjectId(groupId)) {
      throw createHttpError(400, "invalid expense id");
    }

    const group = await GroupModel.findById(groupId).exec();

    if (!group) {
      throw createHttpError(404, "Group not found");
    }

    if (!group.isPublic) {
      assertDefined(userId);
      if (!group.owner.equals(userId)) {
        throw createHttpError(401, "You cannot access this group");
      }
    }

    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};

/*
Create new group
Balance Array is filled with 0s
Accepts: Group Name
         Group Emoji Avatar
         Group Currency
         Group Members
Validation: 
*/
interface createGroupBody {
  name?: string;
  emoji?: string;
  currency?: string;
  members?: { name: string }[];
}

export const createGroup: RequestHandler<
  unknown,
  unknown,
  createGroupBody,
  unknown
> = async (req, res, next) => {
  const name = req.body.name;
  const emoji = req.body.emoji;
  const currency = req.body.currency;
  const members = req.body.members;
  const userId = req.session.userId;

  try {
    assertDefined(userId);
    // do better validation
    if (!name || !emoji || !currency || !members)
      throw createHttpError(400, "No required group parameters");

    const memberNames = members.map((a) => a.name);
    if (memberNames.length !== new Set(memberNames).size)
      throw Error("Every member needs a unique name");
    // validate members and create balance table, everyone starts out at 0
    const balance = new Map<string, number>();
    memberNames.forEach((name) => {
      if (!name) throw createHttpError(400, "Group members need a name");
      balance.set(name, 0);
    });

    const newGroup = await GroupModel.create({
      name: name,
      emoji: emoji,
      currency: currency,
      members: members,
      memberBalance: balance,
      owner: userId,
      isPublic: false,
    });

    res.status(201).json(newGroup);
  } catch (error) {
    next(error);
  }
};

interface updateGroupParams {
  groupId: string;
}

interface updateGroupBody {
  name?: string;
  emoji?: string;
  members?: { name: string }[];
}

/*
Change Group name, picture or currency
Balnce Array is filled with 0s
Accepts: Group Name
         Group Emoji Avatar
         Group Currency
Validation: 
*/
export const updateGroup: RequestHandler<
  updateGroupParams,
  unknown,
  updateGroupBody,
  unknown
> = async (req, res, next) => {
  const groupId = req.params.groupId;
  const name = req.body.name;
  const emoji = req.body.emoji;

  const members = req.body.members;
  try {
    // do better validation
    if (!name || !emoji || !members) {
      throw createHttpError(400, "No required group parameters");
    }

    const group = await GroupModel.findById(groupId).exec();

    if (!group) {
      throw createHttpError(404, "Group not found");
    }

    // validate members and create balance table, everyone new starts out at 0
    const memberNames = members.map((a) => a.name);
    if (memberNames.length !== new Set(memberNames).size)
      throw Error("Every member needs a unique name");

    memberNames.slice(group.members.length).forEach((name) => {
      if (!name) throw createHttpError(400, "Group members need a name");
      group.members.push({ name: name });
      group.memberBalance.set(name, 0);
    });

    group.name = name;
    group.emoji = emoji;
    const updatedGroup = await group.save();

    res.status(200).json(updatedGroup);
  } catch (error) {
    next(error);
  }
};

/*
Remove user from group members
Accepts: Group Id, User Id
Validation: User is not the group owner
*/
export const leaveGroup: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;
  const groupId = req.params.groupId;
  try {
    if (!mongoose.isValidObjectId(groupId)) {
      throw createHttpError(400, "Invalid group id");
    }
    const group = await GroupModel.findById(groupId).exec();
    if (!group) {
      throw createHttpError(404, "Group not found");
    }

    if (group.owner.equals(userId)) {
      throw createHttpError(400, "Owner cannot leave the group");
    }

    group.members.forEach((member) => {
      if (member.id === userId) {
        delete member.id;
      }
    });

    const updatedGroup = await group.save();

    res.status(200).json(updatedGroup);
  } catch (error) {
    next(error);
  }
};

/*
Add user to group members
Accepts: Group Id, User Id, name
Validation: (User is not in the group already? )
*/
export const joinGroup: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;
  const groupId = req.params.groupId;
  const name = req.params.name;
  try {
    if (!mongoose.isValidObjectId(groupId)) {
      throw createHttpError(400, "Invalid group id");
    }
    const group = await GroupModel.findById(groupId).exec();
    if (!group) {
      throw createHttpError(404, "Group not found");
    }

    if (group.owner.equals(userId)) {
      throw createHttpError(400, "Owner cannot leave the group");
    }

    group.members.forEach((member) => {
      if (member.id === userId && member.name !== name) {
        throw createHttpError(400, "You cannot join a group twice");
      }
      if (member.name === name) {
        member.id = userId;
      }
    });

    const updatedGroup = await group.save();

    res.status(200).json(updatedGroup);
  } catch (error) {
    next(error);
  }
};

/*
Delete Group with its expenses and settlements
Accepts: Group Id, User Id
Validation: Only the owner can delete a group
*/
export const deleteGroup: RequestHandler = async (req, res, next) => {
  const userId = req.session.userId;
  const groupId = req.params.groupId;
  try {
    if (!mongoose.isValidObjectId(groupId)) {
      throw createHttpError(400, "Invalid group id");
    }
    const group = await GroupModel.findById(groupId).exec();
    if (!group) {
      throw createHttpError(404, "Group not found");
    }

    if (!group.owner.equals(userId)) {
      throw createHttpError(400, "You cannot delete this group");
    }

    // delete group expenses and settlements
    await ExpenseModel.deleteMany({ groupId: groupId });
    await GroupModel.deleteOne({ _id: groupId });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

interface GroupTotal {
  _id: string;
  count: number;
}
export const getTotalGroupExpenses: RequestHandler = async (req, res, next) => {
  const groupId = req.params.groupId;
  const group = await GroupModel.findById(groupId).exec();
  try {
    const total = await ExpenseModel.aggregate<GroupTotal>([
      {
        $match: {
          groupId: group?._id,
          category: { $not: { $eq: "Transfer" } },
        },
      },
      {
        $group: {
          _id: "$groupId",
          count: { $sum: "$amount" },
        },
      },
    ]).exec();
    res.status(200).json(total[0].count);
  } catch (error) {
    next(error);
  }
};

export const getGroupCategoryExpenses: RequestHandler = async (
  req,
  res,
  next
) => {
  const groupId = req.params.groupId;
  try {
    const group = await GroupModel.findById(groupId).exec();
    const total = await ExpenseModel.aggregate<GroupTotal>([
      {
        $match: {
          groupId: group?._id,
          category: { $not: { $eq: "Transfer" } },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: "$amount" },
        },
      },
    ]).exec();
    const result = total.map((cat) => [cat._id, cat.count]);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getGroupUserPaid: RequestHandler = async (req, res, next) => {
  const groupId = req.params.groupId;
  try {
    const group = await GroupModel.findById(groupId).exec();
    const total = await ExpenseModel.aggregate<GroupTotal>([
      {
        $match: {
          groupId: group?._id,
          category: { $not: { $eq: "Transfer" } },
        },
      },
      {
        $group: {
          _id: "$paidBy",
          count: { $sum: "$amount" },
        },
      },
    ]).exec();
    const result = total.map((cat) => [cat._id, cat.count]);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getGroupMonthlyExpenses: RequestHandler = async (
  req,
  res,
  next
) => {
  const groupId = req.params.groupId;
  try {
    const group = await GroupModel.findById(groupId).exec();
    const total = await ExpenseModel.aggregate<GroupTotal>([
      {
        $match: {
          groupId: group?._id,
          category: { $not: { $eq: "Transfer" } },
        },
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: "$amount" },
        },
      },
    ]).exec();
    const result = total.map((cat) => [cat._id, cat.count]);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
