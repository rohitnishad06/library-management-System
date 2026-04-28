import express from "express";
import { auth } from "../middleware/auth.js";
import { getActiveTransaction, getActiveTransactions, getOverdueTransactions, getPendingTransactions, getTransactionFine, issueBook, returnBook } from "../controllers/transactionController.js";


const transactionRouter = express.Router();

transactionRouter.post("/issue",auth ,issueBook);
transactionRouter.post("/return-init",auth ,getActiveTransaction);
transactionRouter.post("/return",auth ,returnBook);
transactionRouter.get("/fine/:transactionId",auth ,getTransactionFine);
transactionRouter.get("/active",auth ,getActiveTransactions);
transactionRouter.get("/overdue",auth ,getOverdueTransactions);
transactionRouter.get("/requests",auth ,getPendingTransactions);

export default transactionRouter;