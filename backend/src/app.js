import express from "express"
import cors from "cors"
import "./cron.js";

const app = express()

// Enhanced CORS configuration for multiple origins
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ["http://localhost:5173"];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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
