import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    membershipId: {
      type: String,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    contactAddress: {
      type: String,
      required: true,
    },

    aadharCardNo: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    membershipType: {
      type: String,
      required: true,
      enum: ["6months", "1year", "2years"],
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    pendingFine: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Middleware to generate membership ID
memberSchema.pre("save", async function () {
  if (!this.membershipId) {
    const count = await mongoose.model("Member").countDocuments();
    this.membershipId = `MEM${String(count + 1).padStart(6, "0")}`;
  }
});

const memberModel = mongoose.model("Member", memberSchema);

export default memberModel;
