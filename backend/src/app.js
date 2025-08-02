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

export {app}


import router from "./routes/file.routes.js";

app.use("/api/v1/file",router)
