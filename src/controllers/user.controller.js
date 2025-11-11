import authConfigs from "../config/auth.config.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const userRegister = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const user = await User.create({ name, email, password, phoneNumber });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.toString(),
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found, login falied.",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    console.log(isMatched);

    if (!isMatched) {
      return res.status(404).json({
        success: false,
        message: "Wrong password, login falied.",
      });
    } else {
      const token = authConfigs.encodeToken(user.email, user._id.toString());

      res.cookie("user-token", token);
      res.status(200).json({
        success: true,
        message: "Login Successful.",
        user: {
          id: user._id,
          email: user.email,
        },
        token: token,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Login failed.",
    });
  }
};

// For testing
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get users",
      error: error.toString(),
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.headers._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profil loaded successfully.",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load user profile.",
      error: error.toString(),
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const user = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Error updating User.",
    });
  }
};

const userLogout = (req, res) => {
  res.clearCookie("user-token");
  res.status(200).json({ success: true, message: "Logged out successfully." });
};

const userControllers = {
  userRegister,
  userLogin,
  getAllUsers,
  getUserProfile,
  updateUser,
  userLogout,
};

export default userControllers;
