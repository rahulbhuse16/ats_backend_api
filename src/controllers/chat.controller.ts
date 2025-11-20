import { Request, Response } from "express";
import { ragAnswer } from "../services/rag.service";

export async function chat(req: Request, res: Response) {
  try {
    const { question } = req.body;
    console.log(req.body)
    if (!question) return res.status(400).json({ error: "Missing question" });
    const result = await ragAnswer(question);
    return res.json(result);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "chat error" });
  }
}
