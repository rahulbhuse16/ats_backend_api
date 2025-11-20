import express from "express";
import multer from "multer";
import { scoreFromUploads } from "../controllers/score.controller";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.fields([{ name: "resume" }, { name: "jd" }]), scoreFromUploads);

export default router;
