import express from "express";
import http from "http";
import connectDb from "./config/db.js";
import routes from "./routes/index.js";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://meditation-app-frontend.vercel.app",
    "http://localhost:3001",
    "https://tribicx.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is working");
});

app.get("/test", (req, res) => {
  res.send({
    message: "Platform detection working!",
    platform: req.platform,
  });
});

app.get("/check", (req, res) => {
  res.status(200).json({
    platform: req.platform,
    message: "Running",
  });
});

app.use("/api", routes);

connectDb();

const server = http.createServer(app);

export { server };
export default app;
