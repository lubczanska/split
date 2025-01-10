import express from "express";
import * as ExpensesController from "../controllers/expenses";

const router = express.Router();
router.get("/view/:groupId", ExpensesController.getGroupExpenses);
router.get("/:expenseId", ExpensesController.getExpense);
router.post("/:groupId/addExpense", ExpensesController.createExpense);
router.patch("/:expenseId", ExpensesController.updateExpense);
router.delete("/:expenseId", ExpensesController.deleteExpense);

export default router;
