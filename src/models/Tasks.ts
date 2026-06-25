import mongoose, { Document, Schema, Model } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  dueDate: Date;
  status: "Pending" | "InProgress" | "Done";
  assignedTo: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const TaskSchema = new Schema<ITask>(
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
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "InProgress", "Done"],
      default: "Pending",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  { timestamps: true },
);

const Task: Model<ITask> = mongoose.model<ITask>("Task", TaskSchema);

export default Task;
