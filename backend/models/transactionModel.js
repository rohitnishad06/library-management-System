import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    bookSerialNo: {
      type: String,
      required: true,
    },

    bookName: {
      type: String,
      required: true,
    },

    authorName: {
      type: String,
      required: true,
    },

    membershipId: {
      type: String,
      required: true,
    },

    issueDate: {
      type: Date,
      required: true,
    },

    returnDate: {
      type: Date,
      required: true,
    },

    actualReturnDate: {
      type: Date,
    },

    remarks: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "returned", "overdue", "pending"],
      default: "pending",
    },

    fineCalculated: {
      type: Number,
      default: 0,
    },

    finePaid: {
      type: Boolean,
      default: false,
    },

    isRequest: {
      type: Boolean,
      default: false,
    },

    requestFulfilledDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Middleware to generate transaction ID
transactionSchema.pre("save", async function () {
  if (!this.transactionId) {
    const count = await mongoose.model("Transaction").countDocuments();
    this.transactionId = `TXN${String(count + 1).padStart(6, "0")}`;
  }
});

const transactionModel = mongoose.model("Transaction", transactionSchema);

export default transactionModel;
