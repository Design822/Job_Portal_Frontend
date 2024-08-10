import express from "express";
import dotenv from "dotenv";
import categoryRoute from "./routes/category/index";
import companyRoute from "./routes/company/index";
import jobSeeker from "./routes/job_seeker/index";
import adminRouter from "./routes/admin/index";
dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req: any, res: any) => {
  res.send("Job Portal");
});
app.use("/image", express.static("public/"));

app.use("/category", categoryRoute);
app.use("/company", companyRoute);
app.use("/job_seeker", jobSeeker);
app.use("/admin", adminRouter);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
