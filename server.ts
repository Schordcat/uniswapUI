import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import openaiRoute from "./api/openai"; // this must point to the default `router`

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use("/api/openai", openaiRoute);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});