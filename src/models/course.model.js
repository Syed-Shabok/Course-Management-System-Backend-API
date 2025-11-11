import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [3, "Course title must be at least 3 characters long"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      minlength: [10, "Description should be at least 10 characters long"],
    },
    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: [0, "Price cannot be negative"],
    },
    duration: {
      type: String,
      required: [true, "Course duration is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Course category is required"],
      trim: true,
      enum: [
        "Programming",
        "Electrical",
        "Mechanical",
        "Marketing",
        "Business",
        "Other",
      ],
    },
    instructorName: {
      type: String,
      required: [true, "Instructor name is required"],
      trim: true,
    },
    courseImage: {
      url: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
