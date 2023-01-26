import Freelancer from "../models/Freelancer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import client from "./bot.js";
import fs from "fs";

dotenv.config();

const generateToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const signUp = async (req, res, next) => {
  let { name, npm, nowa, password, faculty, major } = req.body;
  const ktm = req.file.filename;
  try {
    //check if freelancer already exists
    const freelancer = await Freelancer.findOne({ where: { npm: npm } });
    if (freelancer) {
      return res.status(409).json({ message: "NPM sudah terdaftar silahkan login" });
    }

    //generate 6 digits otp
    const otp = Math.floor(100000 + Math.random() * 900000);
    password = await bcrypt.hash(password, 10);

    const data = await Freelancer.create({
      name,
      npm,
      nowa,
      password,
      faculty,
      major,
      otp,
      ktm,
    });

    req.body.id = data.id;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  let { npm, password } = req.body;
  try {
    const data = await Freelancer.findOne({ where: { npm: npm } });
    if (!data) {
      return res.status(404).json({ message: "NPM tidak terdaftar" });
    }

    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" });
    }
    const token = generateToken({ id: data.id, name: data.name, nowa: data.nowa, isWaVerified: data.isWaVerified, isVerified: data.isVerified, role: "freelancer" });
    res.status(200).json({ token: token, message: "Login Sukses" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendOtp = async (req, res) => {
  const { id } = req.body;

  try {
    const freelancer = await Freelancer.findOne({ where: { id: id } });
    //convert nowa to +62
    let nowa = freelancer.nowa.replace("0", "+62");
    // send otp via whatsapp
    client.emit("send-message", { nowa: nowa, message: `Kode otp anda adalah ${freelancer.otp}` });
    //generate token
    const token = generateToken({ id: freelancer.id, name: freelancer.name, nowa: freelancer.nowa, isWaVerified: freelancer.isWaVerified, isVerified: freelancer.isVerified, role: "freelancer" });
    res.status(200).json({ token: token, message: "Sukses" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const confirmOtp = async (req, res) => {
  const { id, otp } = req.body;
  try {
    const freelancer = await Freelancer.findOne({ where: { id: id } });
    if (!freelancer) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    if (freelancer.otp == otp) {
      freelancer.isWaVerified = true;
      await freelancer.save();
      //update token
      const token = generateToken({ id: freelancer.id, name: freelancer.name, isWaVerified: freelancer.isWaVerified, isVerified: freelancer.isVerified, role: "freelancer" });

      res.status(200).json({ token: token, message: "OTP berhasil diverifikasi" });
    } else {
      return res.status(400).json({ message: "OTP salah" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOtp = async (req, res) => {
  const { id } = req.body;
  try {
    const freelancer = await Freelancer.findOne({ where: { id: id } });

    //generate 6 digits otp
    const otp = Math.floor(100000 + Math.random() * 900000);
    freelancer.otp = otp;
    await freelancer.save();
    //convert nowa to +62
    let nowa = freelancer.nowa.replace("0", "+62");
    // send otp via whatsapp
    client.emit("send-message", { nowa: nowa, message: `Kode otp anda adalah ${otp}` });
    res.status(200).json({ message: "Sukses" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const getFreelancerById = async (req, res) => {
  const { id } = req.params;
  try {
    const freelancer = await Freelancer.findAll({ where: { id: id } });
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer tidak ditemukan" });
    }
    res.status(200).json({ data: freelancer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get freelancer by isVerified false
export const getFreelancerByIsVerifiedFalse = async (req, res) => {
  try {
    const freelancer = await Freelancer.findAll({ where: { isVerified: false } });
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer tidak ditemukan" });
    }
    res.status(200).json(freelancer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//verify freelancer
export const verifyFreelancer = async (req, res) => {
  const { id } = req.body;
  try {
    const freelancer = await Freelancer.findOne({ where: { id: id } });
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer tidak ditemukan" });
    }
    freelancer.isVerified = true;
    await freelancer.save();
    const nowa = freelancer.nowa.replace("0", "+62");
    client.emit("send-message", { nowa: nowa, message: `Selamat akun anda telah diverifikasi🎉. Silahkan login ulang.` });
    res.status(200).json({ message: "Freelancer berhasil diverifikasi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//decline freelancer then delete
export const declineFreelancer = async (req, res) => {
  const { id } = req.body;
  try {
    const freelancer = await Freelancer.findOne({ where: { id: id } });
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer tidak ditemukan" });
    }
    const nowa = freelancer.nowa.replace("0", "+62");
    await freelancer.destroy();
    client.emit("send-message", { nowa: nowa, message: `Maaf, verifikasi akun anda ditolak😭` });
    res.status(200).json({ message: "Freelancer berhasil ditolak" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update profile pict
export const updateProfilePict = async (req, res) => {
  const { id } = req.body;

  const pp = req.file.filename;

  const freelancer = await Freelancer.findOne({ where: { id: id } });
  if (!freelancer) {
    return res.status(404).json({ message: "Freelancer tidak ditemukan" });
  }
  //delete previous profile pict if it's not default.jpg
  if (freelancer.profilePict !== "default.jpg") {
    fs.unlink(`./uploads/${freelancer.profilePict}`, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  freelancer.profilePict = pp;
  try {
    await freelancer.save();
    res.status(200).json({ message: "Profile picture berhasil diubah" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { nowa, bio, id } = req.body;
  try {
    const freelancer = await Freelancer.findOne({ where: { id: id } });
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer tidak ditemukan" });
    }

    if (freelancer.nowa !== nowa) {
      //isWaVerified false
      freelancer.isWaVerified = false;
      //generate 6 digits otp
      const otp = Math.floor(100000 + Math.random() * 900000);
      freelancer.otp = otp;

      //convert nowa to +62
      let nowaConvert = nowa.replace("0", "+62");
      // send otp via whatsapp
      client.emit("send-message", { nowa: nowaConvert, message: `Kode otp anda adalah ${otp}` });
    }

    freelancer.nowa = nowa;
    freelancer.bio = bio;

    await freelancer.save();
    //generate token
    const token = generateToken({ id: freelancer.id, name: freelancer.name, nowa: freelancer.nowa, isWaVerified: freelancer.isWaVerified, isVerified: freelancer.isVerified, role: "freelancer" });
    res.status(200).json({ token: token, message: "Profile berhasil diubah" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
