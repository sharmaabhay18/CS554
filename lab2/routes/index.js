const products = require("../data/product");

const routeConstructor = (app) => {
  app.get("/", (_, res) => res.render("home", { productList: products }));

  //For routes which does not exists
  app.use("*", (_, res) =>
    res.send({ message: "Error 404: Resource not found" })
  );
};

module.exports = routeConstructor;
