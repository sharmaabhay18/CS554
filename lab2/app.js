const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const helper = require("./utils/helperFunction");

const static = express.static(__dirname + "/public");

const routeConstructor = require("./routes");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: helper,
  })
);
app.set("view engine", "handlebars");

routeConstructor(app);

app.listen(3000, () => console.log("Server started at port 3000"));
