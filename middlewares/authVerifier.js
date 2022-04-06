const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    if (!token)
      return res
        .status(403)
        .json({ msg: "You need to login to create a feed" });

    const decoded = jwt.verify(token, process.env.JWTsecret);
    // console.log({decoded})

    req.user = decoded.user;
    req.token = token;
    next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized, you need to log in",
    });
  }
};

module.exports = verifyToken;
