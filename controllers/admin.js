import Admin from "../models/Admin.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const generateToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { username: username, password: password } });
    if (!admin) {
      return res.status(404).json({ message: "Username atau password salah" });
    }
    const token = generateToken({ id: admin.id, username: admin.username, role: "admin" });
    res.status(200).json({ token: token, message: "Login Sukses" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
