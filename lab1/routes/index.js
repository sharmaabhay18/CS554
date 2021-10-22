const blogRoutes = require("./blogs");

const routeConstructor = (app) => {
  app.use("/blog", blogRoutes);

  //For routes which does not exists
  app.use("*", (_, res) =>
    res.status(404).json({ message: "Resource not found" })
  );
};

module.exports = routeConstructor;
