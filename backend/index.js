import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import bookRouter from "./routes/bookRouter.js";
import memberRouter from "./routes/memberRouter.js";
import transactionRouter from "./routes/transactionRouter.js";
import userRouter from "./routes/userRouter.js";
import userModel from "./models/userModel.js";
import bookModel from "./models/bookModel.js";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// // Routes
app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use('/api/members', memberRouter);
app.use('/api/transactions',transactionRouter);
app.use('/api/users',userRouter);


// Seed initial data
async function seedData() {
  const User = userModel
  const Book = bookModel

  const adminExists = await User.findOne({ username: 'adm' });
  if (!adminExists) {
    const hashedAdminPwd = await bcrypt.hash('adm', 10);
    const hashedUserPwd = await bcrypt.hash('user', 10);

    await User.insertMany([
      { username: 'adm', password: hashedAdminPwd, name: 'Administrator', role: 'admin', isActive: true },
      { username: 'user', password: hashedUserPwd, name: 'Library User', role: 'user', isActive: true }
    ]);
    console.log('Default users seeded: adm/adm and user/user');
  }

  const bookCount = await Book.countDocuments();
  if (bookCount === 0) {
    const sampleBooks = [
      { serialNo: 'SCB000001', name: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', type: 'book', cost: 499, procurementDate: new Date('2023-01-15'), status: 'available', quantity: 3 },
      { serialNo: 'SCB000002', name: 'The Selfish Gene', author: 'Richard Dawkins', category: 'Science', type: 'book', cost: 399, procurementDate: new Date('2023-02-20'), status: 'available', quantity: 2 },
      { serialNo: 'ECB000001', name: 'Thinking Fast and Slow', author: 'Daniel Kahneman', category: 'Economics', type: 'book', cost: 599, procurementDate: new Date('2023-03-10'), status: 'available', quantity: 4 },
      { serialNo: 'ECB000002', name: 'Freakonomics', author: 'Steven Levitt', category: 'Economics', type: 'book', cost: 349, procurementDate: new Date('2023-04-05'), status: 'available', quantity: 2 },
      { serialNo: 'FCB000001', name: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', type: 'book', cost: 299, procurementDate: new Date('2023-01-25'), status: 'available', quantity: 5 },
      { serialNo: 'FCB000002', name: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', type: 'book', cost: 249, procurementDate: new Date('2023-02-14'), status: 'available', quantity: 3 },
      { serialNo: 'CHB000001', name: 'Harry Potter and the Sorcerer Stone', author: 'J.K. Rowling', category: 'Children', type: 'book', cost: 450, procurementDate: new Date('2023-05-01'), status: 'available', quantity: 6 },
      { serialNo: 'PDB000001', name: 'Atomic Habits', author: 'James Clear', category: 'Personal Development', type: 'book', cost: 399, procurementDate: new Date('2023-06-15'), status: 'available', quantity: 4 },
      { serialNo: 'SCM000001', name: 'Cosmos', author: 'Carl Sagan', category: 'Science', type: 'movie', cost: 199, procurementDate: new Date('2023-07-10'), status: 'available', quantity: 2 },
      { serialNo: 'FCM000001', name: 'Inception', author: 'Christopher Nolan', category: 'Fiction', type: 'movie', cost: 299, procurementDate: new Date('2023-08-01'), status: 'available', quantity: 3 }
    ];
    await Book.insertMany(sampleBooks);
    console.log('Sample books & movies seeded');
  }
}
seedData()

app.listen(PORT, () =>{
  console.log(`Server is running on ${PORT}`)
  connectDB();
});
