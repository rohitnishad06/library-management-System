import express from "express";
import { adminOnly, auth } from "../middleware/auth.js";
import { addBook, getAllBooks, getBookList, searchBooks, updateBook } from "../controllers/bookController.js";


const bookRouter = express.Router();

bookRouter.get("/",auth, getAllBooks);
bookRouter.get("/available-book",auth , searchBooks);
bookRouter.get("/book-name",auth, getBookList);
bookRouter.post("/",auth, adminOnly, addBook);
bookRouter.put("/update-book/:id",auth, adminOnly, updateBook);

export default bookRouter;