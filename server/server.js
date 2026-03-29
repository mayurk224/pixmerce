import "dotenv/config";
import connectDB from "./config/db.js";
import app from "./src/app.js";

connectDB();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
