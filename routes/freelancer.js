import multer from "multer";
import express from "express";
import { signUp, login, confirmOtp, sendOtp, resendOtp, getFreelancerById, getFreelancerByIsVerifiedFalse, verifyFreelancer, declineFreelancer } from "../controllers/freelancer.js";

const imgURL = "uploads/";
// storage engine multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imgURL);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

router.post("/signup", upload.single("ktm"), signUp, sendOtp);
router.post("/login", login);
router.post("/check-otp", confirmOtp);
router.get("/unverified", getFreelancerByIsVerifiedFalse);
router.post("/resend-otp", resendOtp);
router.get("/:id", getFreelancerById);
router.post("/verify", verifyFreelancer);
router.post("/decline", declineFreelancer);
//testing bot ex:{id: 1}
// router.post("/send-otp", sendOtp);

export default router;
