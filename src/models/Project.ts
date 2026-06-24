import mongoose, { Document, Schema, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  status: "Active"  | "Completed" | "Pending";
  User: mongoose.Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Completed", "Pending"],
      default: "Pending",
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Project: Model<IProject> = mongoose.model<IProject>(
  "Project",
  ProjectSchema,
);
export default Project;
