import express from "express";
import { corsMiddleware } from "./middlewares/cors.middleware";

const app = express();
app.use(corsMiddleware);

app.listen(8000, () => {
  console.log("Server is running on port 3000");
});