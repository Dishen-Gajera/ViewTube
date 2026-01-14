import jwt from "jsonwebtoken";
const genToken = async (id) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
  } catch (error) {
    console.log(error);
  }
};
export default genToken;
