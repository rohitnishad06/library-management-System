import jwt from "jsonwebtoken";

// Authentication Middleware
export const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // attach user data to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// Admin Authorization Middleware
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Admin access required" });
  }

  next();
};
