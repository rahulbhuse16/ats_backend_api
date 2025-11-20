import { embedText, chatCompletion } from "./embedding.service";
import config from "../config";
import { VectorStore } from "./vectorStore.service";
import { cosineSim } from "../utils/similarity";

export async function ingestDocument(text: string, source: "resume" | "jd") {
  const { chunkText } = await import("../utils/chunker");
  const chunks = chunkText(text, config.chunkSize, config.chunkOverlap);
  if (chunks.length === 0) return [];

  // embed chunks
  const embeddings = await embedText(chunks);
  const items = chunks.map((c, i) => ({
    source,
    text: c,
    embedding: embeddings[i],
    meta: { length: c.length }
  }));
  return VectorStore.addMany(items);
}

export async function getMatchScoreForResumeVsJD(resumeText: string, jdText: string) {
  // embed entire resume and JD (or use chunks-average)
  const [rEmb] = await embedText(resumeText);
  const [jEmb] = await embedText(jdText);
  const sim = cosineSim(rEmb, jEmb);
  const scorePct = Math.round(sim * 100);
  return scorePct;
}

export async function ragAnswer(question: string) {
  // embed question
  const [qEmb] = await embedText(question);

  // retrieve top-k
  const retrieved = await VectorStore.searchByEmbedding(qEmb, config.topK);
  // build prompt with retrieved contexts
  const context = retrieved.map((r, idx) => `Context ${idx + 1} (${r.source}, score=${(r as any).score?.toFixed(3)}):\n${r.text}`).join("\n\n---\n\n");

  const systemPrompt = "You are an assistant answering about candidate resumes and job descriptions. Use the provided contexts to answer precisely and mention source (resume/jd) when you quote.";
  const messages = [
    { role: "user", content: `Question: ${question}\n\nRelevant contexts:\n${context}\n\nAnswer concisely and cite whether info came from resume or jd when possible.` }
  ];
  const answer = await chatCompletion(systemPrompt, messages);
  return { answer, retrieved };
}
