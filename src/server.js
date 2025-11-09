import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.config.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "API is working.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
