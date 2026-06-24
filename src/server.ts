import dotenv from "dotenv";
import connectDB from "./config/connectDB";
import app from "./app";

dotenv.config({ path: ".env" });
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});