import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  countProjects,
} from "../controllers/ProjectController";

const router = express.Router();

router.get("/count", countProjects);
router.post("/", createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;




















// import express from "express";
// import {
//   getAllPosts,
//   getPostById,
//   createPost,
//   updatePost,
//   deletePost,
// } from "../controllers/postController.js";
// import upload from "../utils/multer.js";
// import { ValidatedID } from "../middlewares/validateId.js";
// import { validate } from "../middlewares/Validate.js";
// import { VerifyToken } from "../middlewares/VerifyToken.js";
// import {
//   CreatePostValidation,
//   UpdatePostValidation,
// } from "../validation/PostsValidation.js";

// const router = express.Router();

// router.get("/posts", getAllPosts);
// router.get("/:id", ValidatedID, getPostById);

// router.post(
//   "/",
//   VerifyToken,
//   upload.single("Image"),
//   validate(CreatePostValidation),
//   createPost,
// );

// router.put(
//   "/:id",
//   VerifyToken,
//   ValidatedID,
//   upload.single("Image"),
//   validate(UpdatePostValidation),
//   updatePost,
// );

// router.delete("/:id", VerifyToken, ValidatedID, deletePost);

// export default router;