import { Request, Response } from "express";
import { compareResumeAndJD, extractTextFromFile } from "../utils/textExtractor";
import { getMatchScoreForResumeVsJD, ingestDocument } from "../services/rag.service";
import fs from "fs";

export async function scoreFromUploads(req: Request, res: Response) {
  try {
    console.log("payload", req.files);

    const files = req.files as {
      resume?: Express.Multer.File[];
      jd?: Express.Multer.File[];
    };

    if (!files.resume || !files.jd) {
      return res.status(400).json({ error: "Provide resume and jd files" });
    }

    const resumeFile = files.resume[0];
    const jdFile = files.jd[0];

    const resumeText = await extractTextFromFile(resumeFile.path);
    const jdText = await extractTextFromFile(jdFile.path);

    await ingestDocument(resumeText, "resume");
    await ingestDocument(jdText, "jd");

    const score = await getMatchScoreForResumeVsJD(resumeText.text, jdText.text);

    const gapsAndStrengths=compareResumeAndJD(resumeText.text,jdText.text)
    fs.unlinkSync(resumeFile.path);
    fs.unlinkSync(jdFile.path);

    return res.json({
      matchScore: score,
      strengths: gapsAndStrengths.strengths,
      gaps: gapsAndStrengths.gaps,
      note: "strengths and gaps can be populated later",
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "score error" });
  }
}
