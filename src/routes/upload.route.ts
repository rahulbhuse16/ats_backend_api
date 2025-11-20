import express from "express";
import multer from "multer";
import { uploadResume, uploadJD } from "../controllers/upload.controller";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/resume", upload.single("resume"), uploadResume);
router.post("/jd", upload.single("jd"), uploadJD);

export default router;
