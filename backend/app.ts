import express from "express";
import router from "./routes";

const app = express();
const PORT = 8000;

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
