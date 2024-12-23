import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import express from "express";
import connectMongoDB from "./db/connectMongoDB.js";
import authRoutes from "./routes/auth.routes.js";
configDotenv();
const app = express();
app.use(express.json())
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectMongoDB();
  console.log(`Listening to http://localhost:3000`);
})