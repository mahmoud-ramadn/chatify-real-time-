import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import path from "path";
import { connectDB } from "./lib/db.js";
dotenv.config();
const app = express();
const __dirname = path.resolve();
const port = process.env.PORT || 3000;

app.use(express.json());
app.get("/", (req, res) => res.send({ message: "Welcome to the server" }));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontEnd/dist")));
  app.get("*", (_, res) =>
    res.sendFile(path.join(__dirname, "../frontEnd", "dist", "index.html"))
  );
}

app.listen(port, () => {
  console.log("Server is running on port " + port);
  connectDB();
});
