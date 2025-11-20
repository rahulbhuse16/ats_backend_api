import { Request, Response } from "express";
import { extractTextFromFile } from "../utils/textExtractor";
import config from "../config";
import { ingestDocument } from "../services/rag.service";
import fs from "fs";
import path from "path";

export async function uploadResume(req: Request, res: Response) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file" });
    const file = req.file;
    const filePath = file.path;
    const text = (await extractTextFromFile(file.path));
    await ingestDocument(text, "resume");
    // remove uploaded file
    fs.unlinkSync(filePath);
    return res.json({ ok: true, message: "Resume ingested", textLength: text });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "upload error" });
  }
}

export async function uploadJD(req: Request, res: Response) {
        console.log("jd payload",req.file)

  try {
    if (!req.file) return res.status(400).json({ error: "No file" });
    const file = req.file;
    const filePath = file.path;
    const text = await extractTextFromFile(filePath);
    await ingestDocument(text, "jd");
    fs.unlinkSync(filePath);
    return res.json({ ok: true, message: "Job description ingested", textLength: text.length });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "upload error" });
  }
}
