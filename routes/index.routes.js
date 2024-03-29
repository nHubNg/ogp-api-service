const userRoutes = require("./users.routes");
const feedRoutes = require("./feeds.routes");
const authRoutes = require("./auth.routes");
const landingPageRoutes = require("./landingpage.routes");

const routers = (app) => {
	app.use("/api/v1/user", userRoutes);
	app.use("/api/v1/feed", feedRoutes);
	app.use("/api/v1/auth", authRoutes);
	app.use("/", landingPageRoutes);
};

module.exports = routers;
