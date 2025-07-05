import express from "express";
import cors from "cors";
import dashRouter from "./routes/dashRoute.js";
import bodyParser from "body-parser";
import path from 'path';


// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/quickdash", dashRouter);

// Test API route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
