import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 4000,
  openaiKey: process.env.OPENAI_API_KEY || "",
  embedModel: process.env.EMBED_MODEL || "text-embedding-3-small",
  chatModel: process.env.CHAT_MODEL || "gpt-4o-mini",
  vectorPath: process.env.VECTORSTORE_PATH || "./data/vectors.json",
  chunkSize: Number(process.env.CHUNK_SIZE || 800),
  chunkOverlap: Number(process.env.CHUNK_OVERLAP || 200),
  topK: Number(process.env.TOP_K || 4)
};
