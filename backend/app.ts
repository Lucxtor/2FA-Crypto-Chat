import cors from "cors";
import express from "express";
import router from "./app/routes";

const app = express();
const PORT = 8000;

app.use(cors());

app.use(express.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
