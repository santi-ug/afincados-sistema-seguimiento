import dotenv from "dotenv";
import express from "express";
import router from "./routes/router.js";
import cors from "cors";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
