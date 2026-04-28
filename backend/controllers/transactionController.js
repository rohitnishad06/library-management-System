import bookModel from "../models/bookModel.js";
import memberModel from "../models/memberModel.js";
import transactionModel from "../models/transactionModel.js";

const FINE_PER_DAY = 5;

// Issue a book
export const issueBook = async (req, res) => {
  try {
    const { bookSerialNo, membershipId, issueDate, returnDate, remarks } =
      req.body;

      console.log(bookSerialNo)

    // Validation
    if (!bookSerialNo || !membershipId || !issueDate) {
      return res.status(400).json({
        message: "Book serial, membership ID, and issue date are required",
      });
    }

    // Find Book
    const book = await bookModel.findOne({ serialNo: bookSerialNo });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableQty <= 0) {
      return res.status(400).json({ message: "Book not available" });
    }

    // Find Member
    const member = await memberModel.findOne({
      membershipId,
      status: "active",
    });

    if (!member) {
      return res.status(404).json({ message: "Active member not found" });
    }

    // Prevent multiple active issues of same book by same member
    const existingTxn = await transactionModel.findOne({
      membershipId,
      bookSerialNo,
      status: "active",
    });

    if (existingTxn) {
      return res.status(400).json({
        message: "This book is already issued to this member",
      });
    }

    // Dates
    const issue = new Date(issueDate);

    const ret = returnDate
      ? new Date(returnDate)
      : new Date(issue.getTime() + 15 * 24 * 60 * 60 * 1000); // default 15 days

    // Create Transaction
    const txn = new transactionModel({
      bookId: book._id,
      memberId: member._id,
      bookSerialNo: book.serialNo,
      bookName: book.name,
      authorName: book.author,
      membershipId: member.membershipId,
      issueDate: issue,
      returnDate: ret,
      remarks,
      status: "active",
    });

    await txn.save();

    // Update Book Stock
    book.availableQty -= 1;

    if (book.availableQty === 0) {
      book.status = "issued";
    }

    await book.save();

    res.status(201).json(txn);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Initiate return
export const getActiveTransaction = async (req, res) => {
  try {
    const { bookSerialNo, membershipId } = req.body;

    // Validation
    if (!bookSerialNo || !membershipId) {
      return res.status(400).json({
        message: "Book serial number and membership ID are required",
      });
    }

    // Find active transaction
    const txn = await transactionModel.findOne({
      bookSerialNo,
      membershipId,
      status: "active",
    });

    if (!txn) {
      return res.status(404).json({
        message: "No active issue found",
      });
    }

    res.status(200).json(txn);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Process return & fine
export const returnBook = async (req, res) => {
  try {
    const { transactionId, actualReturnDate, finePaid, remarks } = req.body;

    // Validation
    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    const txn = await transactionModel.findOne({ transactionId });

    if (!txn) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (txn.status === "returned") {
      return res.status(400).json({
        message: "Book already returned",
      });
    }

    // Dates
    const actual = new Date(actualReturnDate || Date.now());
    const planned = new Date(txn.returnDate);

    const daysLate = Math.max(
      0,
      Math.ceil((actual - planned) / (1000 * 60 * 60 * 24)),
    );

    const fine = daysLate * FINE_PER_DAY;

    // Fine validation
    if (fine > 0 && !finePaid) {
      return res.status(400).json({
        message: "Fine must be paid before returning",
        fineCalculated: fine,
        transactionId,
        actualReturnDate: actual,
      });
    }

    // Update transaction
    txn.actualReturnDate = actual;
    txn.fineCalculated = fine;
    txn.finePaid = finePaid || false;
    txn.remarks = remarks;
    txn.status = "returned";

    await txn.save();

    // Update book stock (safe increment)
    const book = await bookModel.findByIdAndUpdate(
      txn.bookId,
      {
        $inc: { availableQty: 1 },
        $set: { status: "available" },
      },
      { new: true },
    );

    // Update member fine (if applicable)
    if (fine > 0) {
      const member = await memberModel.findById(txn.memberId);

      if (member) {
        member.pendingFine = Math.max(0, member.pendingFine - fine);
        await member.save();
      }
    }

    res.status(200).json({
      message: "Book returned successfully",
      transaction: txn,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Get fine info
export const getTransactionFine = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Validation
    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    // Find transaction
    const txn = await transactionModel.findOne({ transactionId });

    if (!txn) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Dates
    const actual = new Date();
    const planned = new Date(txn.returnDate);

    const daysLate = Math.max(
      0,
      Math.ceil((actual - planned) / (1000 * 60 * 60 * 24)),
    );

    const fine = daysLate * FINE_PER_DAY;

    // Response
    res.status(200).json({
      ...txn.toObject(),
      fineCalculated: fine,
      isOverdue: daysLate > 0,
      daysLate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reports: Active issues
export const getActiveTransactions = async (req, res) => {
  try {
    const txns = await transactionModel.find({ status: "active" }).sort({
      issueDate: -1,
    });

    res.status(200).json(txns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reports: Overdue
export const getOverdueTransactions = async (req, res) => {
  try {
    const now = new Date();

    // Find overdue transactions
    const txns = await transactionModel
      .find({
        status: "active",
        returnDate: { $lt: now },
      })
      .sort({ returnDate: 1 });

    // Add fine calculation
    const result = txns.map((txn) => {
      const daysLate = Math.max(
        0,
        Math.ceil((now - new Date(txn.returnDate)) / (1000 * 60 * 60 * 24)),
      );

      return {
        ...txn.toObject(),
        daysLate,
        fineCalculated: daysLate * FINE_PER_DAY,
        isOverdue: true,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reports: Issue requests (pending)
export const getPendingTransactions = async (req, res) => {
  try {
    const txns = await transactionModel
      .find({ status: "pending" })
      .sort({ createdAt: -1 });

    res.status(200).json(txns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
