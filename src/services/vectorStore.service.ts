import fs from "fs";
import config from "../config";
import { v4 as uuidv4 } from "uuid";
import { readJSON, writeJSON } from "../utils/fileHelper";
import { VectorItem } from "../types";

let store: VectorItem[] = [];

// load at startup
function load() {
  const data = readJSON(config.vectorPath);
  if (data && Array.isArray(data)) store = data;
}
function persist() {
  writeJSON(config.vectorPath, store);
}

load();

export const VectorStore = {
  async addMany(items: Omit<VectorItem, "id">[]) {
    const saved: VectorItem[] = items.map((it) => ({ id: uuidv4(), ...it }));
    store.push(...saved);
    persist();
    return saved;
  },
  async searchByEmbedding(embedding: number[], topK = 4) {
    // naive scan
    const { cosineSim } = await import("../utils/similarity");
    const scored = store.map((it) => ({ item: it, score: cosineSim(embedding, it.embedding) }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map((s) => ({ ...s.item, score: s.score }));
  },
  async clear() {
    store = [];
    persist();
  },
  async getAll() {
    return store;
  }
};
