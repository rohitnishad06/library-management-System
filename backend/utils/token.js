import jwt from "jsonwebtoken";

const genToken = (user) => {
  try {
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );
    return token;
  } catch (error) {
    console.log(error);
  }
};

export default genToken;
