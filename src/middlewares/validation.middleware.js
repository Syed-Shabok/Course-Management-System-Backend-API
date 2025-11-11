import authConfigs from "../config/auth.config.js";

const validateUser = (req, res, next) => {
  const token = req.cookies["user-token"];
  const decoded = authConfigs.decodeToken(token);

  if (decoded === null) {
    return res.status(401).json({
      message: "Invalid token.",
    });
  } else {
    req.headers.email = decoded["email"];
    req.headers._id = decoded["id"];
    next();
  }
};

const validateUserUpdate = (req, res, next) => {
  const { id } = req.params;

  if (req.headers._id !== id) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this account.",
    });
  }

  next();
};

const validationMiddlewares = { validateUser, validateUserUpdate };

export default validationMiddlewares;
