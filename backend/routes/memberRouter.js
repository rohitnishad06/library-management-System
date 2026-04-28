import express from "express";
import { adminOnly, auth } from "../middleware/auth.js";
import { addMember, getAllMembers, updateMembership } from "../controllers/memberController.js";


const memberRouter = express.Router();

memberRouter.get("/", auth, getAllMembers); 
memberRouter.get("/:membershipId", auth, getAllMembers); 
memberRouter.post("/", auth, adminOnly, addMember); 
memberRouter.put("/update-membership/:id", auth, adminOnly, updateMembership); 

export default memberRouter;