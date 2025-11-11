import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.config.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);
// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: err.stack, // optional, remove in production
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "API is working.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
