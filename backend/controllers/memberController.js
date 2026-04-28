import memberModel from "../models/memberModel.js";

// Get all members
export const getAllMembers = async (req, res) => {
  try {
    const members = await memberModel.find().sort({ createdAt: -1 });

    res.status(200).json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get member by membershipId
export const getMemberByMembershipId = async (req, res) => {
  try {
    const { membershipId } = req.params;

    const member = await memberModel.findOne({ membershipId });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add member (admin only)
export const addMember = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      contactNumber,
      contactAddress,
      aadharCardNo,
      startDate,
      membershipType,
    } = req.body;


    // Validation
    if (
      !firstName ||
      !lastName ||
      !contactNumber ||
      !contactAddress ||
      !aadharCardNo ||
      !startDate ||
      !membershipType
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Membership duration logic
    const months =
      membershipType === "6months" ? 6 : membershipType === "1year" ? 12 : 24;

    const start = new Date(startDate);
    const endDate = new Date(start);
    endDate.setMonth(endDate.getMonth() + months);

    // Create member
    const member = new memberModel({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      contactNumber,
      contactAddress,
      aadharCardNo,
      startDate: start,
      endDate,
      membershipType,
    });

    await member.save();

    res.status(201).json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Update membership (admin only)
export const updateMembership = async (req, res) => {
  try {
    const { membershipId, membershipExtension, cancelMembership } = req.body;

    if (!membershipId) {
      return res.status(400).json({ message: "Membership ID is required" });
    }

    const member = await memberModel.findOne({ membershipId });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Cancel Membership
    if (cancelMembership) {
      member.status = "inactive";
    }

    // Extend Membership
    else if (membershipExtension) {
      const months =
        membershipExtension === "6months"
          ? 6
          : membershipExtension === "1year"
            ? 12
            : 24;

      // If membership expired, start from today
      const baseDate =
        member.endDate > new Date() ? new Date(member.endDate) : new Date();

      baseDate.setMonth(baseDate.getMonth() + months);

      member.endDate = baseDate;
      member.status = "active"; // re-activate if extended
    }

    await member.save();

    res.status(200).json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
