import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import sweetsRoutes from "./routes/sweets.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetsRoutes);

// Health check / keep-alive route
app.get("/api/ping", (req, res) => {
  res.status(200).json({ status: "ok", time: new Date().toISOString() });
});

app.get("/", (req, res) => res.send({ message: "Sweet Shop API running" }));

export default app;
