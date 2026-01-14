import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(400).json({ message: "token nnot found" });
    }

    const varifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!varifiedToken) {
      return res.status(400).json({ message: "Invalid token" });
    }

    req.userId = varifiedToken.id;
    next();
  } catch (error) {
    return res.status(500).json({ message: "isAuth error" + error });
  }
};

export default isAuth;
