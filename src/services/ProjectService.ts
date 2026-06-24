import Project, { IProject } from "../models/Project";
import { ApiFeatures } from "../utils/api-features";

export const createProjectService = async (
  data: Partial<IProject>
) => {
  return await Project.create(data);
};

export const getAllProjectsService = async (query: any) => {
  const features = new ApiFeatures(query)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  return await features.execute(Project);
};

export const getProjectByIdService = async (id: string) => {
  return await Project.findById(id);
};

export const updateProjectService = async (
  id: string,
  data: Partial<IProject>
) => {
  return await Project.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteProjectService = async (id: string) => {
  return await Project.findByIdAndDelete(id);
};

export const countProjectsService = async () => {
  return await Project.countDocuments();
};