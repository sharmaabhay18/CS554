const express = require("express");
const app = express();
const session = require("express-session");
const routeConstructor = require("./routes");

app.use(express.json());

app.use(
  session({
    name: "AuthCookie",
    secret: "shinchan",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);

app.post("/blog", (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong while authenticating!",
    });
  }
});

app.put("/blog/:id", (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong while authenticating!",
    });
  }
});

app.patch("/blog/:id", (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong while authenticating!",
    });
  }
});

app.post("/blog/:id/comments", (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong while authenticating!",
    });
  }
});

app.delete("/blog/:blogId/:commentId", (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong while authenticating!",
    });
  }
});

routeConstructor(app);

app.listen(8080, () => console.log("Server started at port 8080"));
