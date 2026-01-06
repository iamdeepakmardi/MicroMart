import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // console.log("Auth Middleware: Checking authorization header");
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    //  console.log("Auth Middleware: No authorization header found");
    return res.status(401).json({ message: "No authorization header" });
  }

  try {
    const token = authHeader.split(" ")[1];
    // console.log(
    //   `Auth Middleware: Token received: ${token.substring(0, 10)}...`
    // );

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(`Auth Middleware: Token verified, userId: ${decodedToken.id}`);

    req.userData = { userId: decodedToken.id };
    next();
  } catch (error) {
    // console.error("Auth Middleware: Error verifying token", error);
    return res
      .status(401)
      .json({ message: "Authentication failed", error: error.message });
  }
};

export default authMiddleware;
