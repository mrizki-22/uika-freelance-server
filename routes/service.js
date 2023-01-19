import express from "express";
import multer from "multer";
import { addService, getServicesCards, getServices, getServicesByCategory, getServicesBySearch, getDetailService } from "../controllers/service.js";

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

router.post(
  "/add-service",
  upload.fields([
    { name: "frontImg", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  addService
);

router.get("/get-services-cards/:id", getServicesCards);
router.get("/get-services", getServices);
router.get("/get-services/:categoryName", getServicesByCategory);
router.get("/search", getServicesBySearch);
router.get("/detail/:id", getDetailService);

export default router;
