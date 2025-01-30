import express from "express";
import * as UsersController from "../controllers/users";

const router = express.Router();
router.get("/", UsersController.getAuthenticatedUser);
router.get("/:userId", UsersController.getUser);
router.get("/getOwed", UsersController.getUserOwed);
router.post("/signup", UsersController.signUp);
router.post("/login", UsersController.logIn);
router.post("/logout", UsersController.logOut);
// router.patch("/:expenseId", UsersController.updateExpense);
// router.delete("/:expenseId", UsersController.deleteExpense);

export default router;