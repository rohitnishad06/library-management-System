import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";

//login 
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username, isActive: true });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Passwword" });

    const token = genToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: `login error ${err}` });
  }
};
