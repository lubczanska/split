import express from "express";
import * as GroupsController from "../controllers/groups";

const router = express.Router();
router.get("/balance/:groupId", GroupsController.getSettlements)
router.get("/", GroupsController.getUserGroups);
router.get("/:groupId", GroupsController.getGroup);
router.post("/", GroupsController.createGroup);
router.patch("/:groupId", GroupsController.updateGroup);
router.delete("/:groupId", GroupsController.deleteGroup);

export default router;