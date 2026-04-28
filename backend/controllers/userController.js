import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "-password");

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add or update user (admin only)
export const manageUser = async (req, res) => {
  try {
    const { username, name, role, isActive, isNew, existingUsername } =
      req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // CREATE USER
    if (isNew) {
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }

      // Check duplicate
      const exists = await userModel.findOne({ username });
      if (exists) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password (default = username, but not recommended)
      const hashedPwd = await bcrypt.hash(username, 10);

      const user = new userModel({
        username: username.trim(),
        name: name.trim(),
        role: role === "admin" ? "admin" : "user",
        isActive: isActive !== false,
        password: hashedPwd,
      });

      await user.save();

      const userObj = user.toObject();
      delete userObj.password;

      return res.status(201).json({
        message: "User created",
        user: userObj,
      });
    }

    // UPDATE USER
    else {
      if (!existingUsername) {
        return res
          .status(400)
          .json({ message: "Existing username is required" });
      }

      const user = await userModel.findOne({ username: existingUsername });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update fields safely
      user.name = name.trim();
      user.role = role === "admin" ? "admin" : "user";
      user.isActive = isActive !== false;

      await user.save();

      const userObj = user.toObject();
      delete userObj.password;

      return res.status(200).json({
        message: "User updated",
        user: userObj,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
