import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

const migrate = async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  await User.updateMany(
    { phone: { $exists: false } },
    {
      $set: {
        phone: "01095496184",
      },
    },
  );

  console.log(" migration completed");
  process.exit();
};

migrate();

// npm run seed
