import express from "express";
import config from "./config";

import { errorHandler } from "./middleware/errorHandler";
import scoreRoutes from "./routes/score.routes";
import uploadRoutes from "./routes/upload.route";
import chatRoutes from "./routes/chat.route";

import { ensureDir } from "./utils/fileHelper";
import cors from 'cors'
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:"*"
}))
ensureDir("uploads");
ensureDir("data");

app.get("/", (req, res) => res.send("Resume RAG Backend"));
app.use(express.json());          // <<<<<<<<<< REQUIRED

app.use("/upload", uploadRoutes);
app.use("/score", scoreRoutes);
app.use("/chat", chatRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
