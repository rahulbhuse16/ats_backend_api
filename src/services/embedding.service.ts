import { pipeline } from "@xenova/transformers";
import config from "../config"; 
import Groq from "groq-sdk"; 
const client = new Groq({ apiKey: config.openaiKey});

let embedder: any;

export async function embedText(texts: string | string[]): Promise<number[][]> {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }

  const input = Array.isArray(texts) ? texts : [texts];

  const vectors = [];
  for (const txt of input) {
    const vec = await embedder(txt, { pooling: "mean", normalize: true });
    vectors.push([...vec.data]);
  }

  return vectors;
}


export async function chatCompletion(systemPrompt: string, messages: any[]) {
  const res = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    max_tokens: 800,
  });

  return res.choices[0].message.content;
}
