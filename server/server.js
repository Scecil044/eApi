import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import colors from "colors";
import path from "path";
import appRoutes from "./routes/v1/index.js";
import { connectDB } from "./config/DB.js";

dotenv.config();
connectDB();
const app = express();
const port = 4008 || process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

// routes
app.use("/api/v1", appRoutes);

// deployment vars

// application middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`.cyan.underline);
});
