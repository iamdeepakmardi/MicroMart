export default {
  port: process.env.PORT || 3003,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
};
