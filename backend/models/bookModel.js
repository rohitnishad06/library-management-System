import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    serialNo: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Science",
        "Economics",
        "Fiction",
        "Children",
        "Personal Development",
      ],
    },

    type: {
      type: String,
      required: true,
      enum: ["book", "movie"],
    },

    cost: {
      type: Number,
      required: true,
    },

    procurementDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "issued", "lost"],
      default: "available",
    },

    quantity: {
      type: Number,
      default: 1,
    },

    availableQty: {
      type: Number,
    },
  },
  { timestamps: true },
);

// Middleware
bookSchema.pre("save", function () {
  if (this.isNew && this.availableQty === undefined) {
    this.availableQty = this.quantity;
  }

});

const bookModel = mongoose.model("Book", bookSchema);

export default bookModel;
