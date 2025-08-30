import express from "express";
import * as UsersController from "../controllers/users";

const router = express.Router();
router.get("/", UsersController.getAuthenticatedUser);
router.get("/:userId", UsersController.getUser);
router.post("/signup", UsersController.signUp);
router.post("/login", UsersController.logIn);
router.post("/logout", UsersController.logOut);

export default router;
