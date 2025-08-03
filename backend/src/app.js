import express from "express"
import cors from "cors"
import "./cron.js";

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}))
app.use("/temp", express.static("public/temp"));

app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Health check endpoint for Render
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShareFiles API is running successfully!",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// API health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

export {app}


import router from "./routes/file.routes.js";

app.use("/api/v1/file",router)
