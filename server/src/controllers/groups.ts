import { RequestHandler } from "express";
import { assertDefined } from "../util/assertDefined";
import GroupModel from "../models/group";
import ExpenseModel from "../models/expense";
import SettlementModel from "../models/transfer";
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
    await SettlementModel.deleteMany({ groupId: groupId });

    await GroupModel.deleteOne({ _id: groupId });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

// export const getUserSpent: RequestHandler = async (req, res, next) => {
//   const userId = req.session.userId;
//   try {
//     assertDefined(userId);
//     const groups = await GroupModel.find({ owner: userId }).exec();
//     res.status(200).json(groups);
//   } catch (error) {
//     next(error);
//   }
// };

/*
TODO:
ALLOW EDITING MEMBERS

*/

// interface addMemberParams {
//   groupId: string;
// }

// interface addMemberBody {
//   name?: string;
//   emoji?: string;
//   bio?: string;
// }

// /*
// Add new member to a group
// */
// export const addMember: RequestHandler<
//   addMemberParams,
//   unknown,
//   addMemberBody,
//   unknown
// > = async (req, res, next) => {
//   const groupId = req.params.groupId;
//   const userId = req.session.userId;
//   const name = req.body.name;
//   const emoji = req.body.emoji;
//   const bio = req.body.bio;

//   try {
//     assertDefined(userId);
//     // do better validation
//     if (!name) throw createHttpError(400, "Group members need a name");

//     const group = await GroupModel.findById(groupId).exec();

//     if (!group) {
//       throw createHttpError(404, "Group not found");
//     }

//     const member = {
//       name: name,
//       emoji: emoji,
//       bio: bio,
//     };
//     group.members.push(member);
//     const updatedGroup = await group.save();

//     res.status(200).json(updatedGroup);
//   } catch (error) {
//     next(error);
//   }
// };

/*
Remove a member with balance 0 from a group
*/
// export const deleteMember: RequestHandler = async (req, res, next) => {};
// export const claimMember: RequestHandler = async (req, res, next) => {};
