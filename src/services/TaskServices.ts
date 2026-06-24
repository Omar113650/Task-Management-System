import Task, { ITask } from "../models/Tasks";
import { ApiFeatures } from "../utils/api-features";

export const createTaskService = async (
  data: Partial<ITask>
) => {
  return await Task.create(data);
};

export const getAllTasksService = async (query: any) => {
  const features = new ApiFeatures(query)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  return await features.execute(Task);
};

export const getTasksByProjectService = async (
  projectId: string
) => {
  return await Task.find({ project: projectId })
    .populate("assignedTo", "name email")
    .populate("project", "title");
};

export const getTaskByIdService = async (id: string) => {
  return await Task.findById(id)
    .populate("assignedTo", "name email")
    .populate("project", "title");
};

export const updateTaskService = async (
  id: string,
  data: Partial<ITask>
) => {
  return await Task.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteTaskService = async (id: string) => {
  return await Task.findByIdAndDelete(id);
};

export const countTasksService = async () => {
  return await Task.countDocuments();
};