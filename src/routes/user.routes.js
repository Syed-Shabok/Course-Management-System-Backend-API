import express from "express";
import userControllers from "../controllers/user.controller.js";
import validationMiddlewares from "../middlewares/validation.middleware.js";
const router = express.Router();

//User Routes:
router.post("/register", userControllers.userRegister);
router.post("/login", userControllers.userLogin);
router.get("/viewUsers", userControllers.getAllUsers); // For testing
router.get(
  "/profile",
  validationMiddlewares.validateUser,
  userControllers.getUserProfile
);
router.put(
  "/:id",
  validationMiddlewares.validateUser,
  validationMiddlewares.validateUserUpdate,
  userControllers.updateUser
);
router.post(
  "/logout",
  validationMiddlewares.validateUser,
  userControllers.userLogout
);

export default router;
