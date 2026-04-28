import express from "express";
import { adminOnly, auth } from "../middleware/auth.js";
import { getAllUsers, manageUser } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.get("/login",auth, adminOnly, getAllUsers);
userRouter.post("/",auth, adminOnly, manageUser);

export default userRouter;