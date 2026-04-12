import express from "express";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { apiRouter } from "./routes";
import bodyParser from "body-parser";
import { clients } from "./config";
import cors from "cors";
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
app.use(cors({
    origin: clients,
    credentials: true
}))
app.use((req, res, next) => {
  if (!req.body) req.body = {}
  next()
})
app.use(corsMiddleware);
app.use(bodyParser.json());

app.use("/api",apiRouter)

app.listen(8000, () => {
  console.log("Server is running on port 3000");
});