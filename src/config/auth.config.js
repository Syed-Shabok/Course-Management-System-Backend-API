import jwt from "jsonwebtoken";

const encodeToken = (email, id) => {
  console.log(email, id);
  const payload = { email, id };
  const key = process.env.JWT_KEY;
  const expire = process.env.JWT_EXPIRES_IN;

  return jwt.sign(payload, key, { expiresIn: expire });
};

const decodeToken = (token) => {
  try {
    const key = process.env.JWT_KEY;
    const decoded = jwt.verify(token, key);
    return decoded;
  } catch (error) {
    return null;
  }
};

const authConfigs = { encodeToken, decodeToken };

export default authConfigs;
