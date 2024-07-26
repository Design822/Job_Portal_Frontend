import express from "express";
import dotenv from "dotenv";
import categoryRoute from "./routes/category/index";
dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req: any, res: any) => {
  res.send("Job Portal");
});

app.use("/category", categoryRoute);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
