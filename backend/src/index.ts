import express from "express";
import dotenv from "dotenv";
import categoryRoute from "./routes/category/index";
import companyRoute from "./routes/company/index";
import jobSeeker from "./routes/job_seeker/index";
import adminRouter from "./routes/admin/index";
import path from "path";
import cors from "cors";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/css", express.static(path.join(__dirname, "../../css")));
app.use("/js", express.static(path.join(__dirname, "../../js")));
app.use("/images", express.static(path.join(__dirname, "../../images")));
app.use("/image", express.static("public/"));
app.use(
  cors({
    origin: "*",
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.get("/", (req: any, res: any) => {
  res.sendFile(path.join(__dirname, "../../home.html"));
});
app.use("/category", categoryRoute);
app.use("/company", companyRoute);
app.use("/job_seeker", jobSeeker);
app.use("/admin", adminRouter);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
