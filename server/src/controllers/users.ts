import { RequestHandler } from "express";
import UserModel from "../models/user";
import createHttpError from "http-errors";
import { compare, hash } from "bcryptjs";
import { assertDefined } from "../util/assertDefined";
import GroupModel from "../models/group";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId)
      .select("+email")
      .exec();
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserOwed: RequestHandler = async (req, res, next) => {
  const userId = req.session.userId;
  try {
    assertDefined(userId);
    const user = await UserModel.findById(req.session.userId).exec();
    if (!user) throw createHttpError(400, "No user");
    // change to member not owner later
    let owed = 0;
    const balances = await GroupModel.find(
      { owner: userId },
      { memberBalance: true }
    ).exec();
    balances.forEach((bal) => {
      const userBal = bal.memberBalance.get(user.username);
      if (userBal) owed += userBal
    });

    res.status(200).json(owed);
  } catch (error) {
    next(error);
  }
};

interface signUpBody {
  username?: string;
  email?: string;
  password?: string;
  fullname?: string;
  bio?: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  signUpBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;
  const fullname = req.body.fullname;
  const bio = req.body.bio;

  try {
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, "missing signup parameters");
    }
    const existingUsername = await UserModel.findOne({
      username: username,
    }).exec();
    if (existingUsername) throw createHttpError(409, "username taken");
    const existingEmail = await UserModel.findOne({ email: email })
      .select(" +email")
      .exec();
    if (existingEmail)
      throw createHttpError(
        409,
        "a user with this email address already exists"
      );
    const passwordHashed = await hash(passwordRaw, 10);

    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: passwordHashed,
      fullname: fullname,
      bio: bio,
    });
    req.session.userId = newUser._id;
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username?: string;
  password?: string;
}
export const logIn: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    if (!username || !password)
      throw createHttpError(400, "missing signup parameters");

    const user = await UserModel.findOne({
      username: username,
    })
      .select("+password +email")
      .exec();
    if (!user) throw createHttpError(401, "invalid credentials");
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) throw createHttpError(401, "invalid credentials");

    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logOut: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};
