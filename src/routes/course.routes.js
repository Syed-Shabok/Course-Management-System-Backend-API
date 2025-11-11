import express from "express";
import courseControllers from "../controllers/course.controller.js";
import validationMiddlewares from "../middlewares/validation.middleware.js";
import upload from "../config/multer.config.js";
const router = express.Router();

router.post(
  "/create",
  upload.single("courseImage"),
  courseControllers.createCourse
);
router.get("/view", courseControllers.getAllCourses);
router.get("/view/:id", courseControllers.getCourseById);
router.put(
  "/update/:id",
  upload.single("courseImage"),
  courseControllers.updateCourse
);
router.delete("/delete/:id", courseControllers.deleteCourse);

export default router;
