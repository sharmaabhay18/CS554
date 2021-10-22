const showsRoutes = require("./shows");

const routeConstructor = (app) => {
  app.use("/", showsRoutes);

  //For routes which does not exists
  app.use("*", (_, res) =>
    res.status(404).render("error", {
      title: "Resource not found",
      errorMessage: "Error 404: Resource not found",
    })
  );
};

module.exports = routeConstructor;
