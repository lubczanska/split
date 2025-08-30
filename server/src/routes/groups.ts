import express from "express";
import * as GroupsController from "../controllers/groups";

const router = express.Router();
router.get("/balance/:groupId", GroupsController.getSettlements);
router.get("/", GroupsController.getUserGroups);
router.get("/:groupId", GroupsController.getGroup);
router.post("/", GroupsController.createGroup);
router.post("/leave/:groupId", GroupsController.leaveGroup);
router.post("/join/:groupId", GroupsController.joinGroup);
router.patch("/:groupId", GroupsController.updateGroup);
router.delete(
  "/:groupId",

  GroupsController.deleteGroup
);

// stats
router.get("/total/:groupId", GroupsController.getTotalGroupExpenses);
router.get(
  "/categoryTotal/:groupId",
  GroupsController.getGroupCategoryExpenses
);
router.get("/userTotal/:groupId", GroupsController.getGroupUserPaid);
router.get("/monthTotal/:groupId", GroupsController.getGroupMonthlyExpenses);

export default router;
