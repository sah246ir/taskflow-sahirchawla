import express from "express";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { apiRouter } from "./routes";

declare global{
  namespace Express{
    interface Request{
      user: {
        userId: string;
        email: string;
      } | null;
    }
  }
}

const app = express();
app.use(corsMiddleware);

app.use("/api",apiRouter)

app.listen(8000, () => {
  console.log("Server is running on port 3000");
});