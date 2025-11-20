export interface VectorItem {
  id: string;
  source: "resume" | "jd";
  text: string;
  embedding: number[];
  meta?: Record<string, any>;
}
