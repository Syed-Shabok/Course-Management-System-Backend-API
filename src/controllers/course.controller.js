import Course from "../models/course.model.js";
import cloudinary from "../config/cloudinary.config.js";

const createCourse = async (req, res) => {
  try {
    const courseImage = req.file.path;
    const { title, description, price, duration, category, instructorName } =
      req.body;

    const data = await Course.create({
      title,
      description,
      price,
      duration,
      category,
      instructorName,
      courseImage,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully.",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Error creating course.",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const facetStage = {
      $facet: {
        totalCount: [{ $count: "count" }],
        courses: [
          { $sort: { createdAt: -1 } },
          {
            $project: {
              title: 1,
              description: 1,
              price: 1,
              duration: 1,
              category: 1,
              instructorName: 1,
              courseImage: 1,
              createdAt: 1,
            },
          },
        ],
      },
    };

    const result = await Course.aggregate([facetStage]);

    res.status(200).json({
      success: true,
      message: "Courses loaded successfully.",
      totalCourses: result[0].totalCount[0]?.count || 0,
      data: result[0].courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error loading courses.",
      error: error.toString(),
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "No such course found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Couse found successfullt.",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting course",
      error: error.toString(),
    });
  }
};

//This is a Utility function:
const extractPublicId = (url) => {
  if (!url) return null;

  const parts = url.split("/upload/")[1];
  if (!parts) return null;

  const publicIdWithVersion = parts.split(".")[0];
  const publicId = publicIdWithVersion.split("/").slice(1).join("/");

  return publicId;
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedData = req.body;

    if (req.file) {
      const existingCourse = await Course.findById(id);

      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message: "No such course found.",
        });
      }

      if (existingCourse.courseImage?.url) {
        const publicId = extractPublicId(existingCourse.courseImage.url);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      updatedData.courseImage = { url: req.file.path };
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      data: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating the course.",
      error: error.toString(),
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.courseImage?.url) {
      const publicId = extractPublicId(course.courseImage.url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.toString(),
    });
  }
};

const courseControllers = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};

export default courseControllers;
