const express = require("express");
const xss = require("xss");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");

const router = express.Router();
const { users, blogs, comments } = require("../data");
const {
  isValidString,
  isValidPositiveNumber,
} = require("../utils/helperFuctions");

const throw400Error = (key, res) =>
  res
    .status(400)
    .json({ status: false, message: `${key} is required parameter` });

const handleCatchError = (error, res) => {
  const statusCode = error?.status || 500;
  const errorMessage = error?.message || "Something went wrong!";

  return res.status(statusCode).json({ status: false, message: errorMessage });
};

const getTakeBlogPayload = (take, blogPayload) => {
  let blogsData = [];
  if (take > 100) {
    blogsData = blogPayload.slice(0, 100);
  } else {
    blogsData = blogPayload.slice(0, take);
  }
  return blogsData;
};

//User routes
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) return throw400Error("UserName is required parameter", res);
    if (!password) return throw400Error("Password is required parameter", res);

    isValidString(username, "Username");
    isValidString(password, "Password");

    xss(username);
    xss(password);

    const userName = username.toLowerCase();

    const user = await users.getUserByUserName(userName);

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch)
      throw { status: 401, message: "Password does not match!" };

    const userPayload = {
      username: user.username,
      name: user.name,
      _id: user._id,
    };

    req.session.user = userPayload;

    return res.status(200).json({ status: true, user: userPayload });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, name, password } = req.body;

    if (!name) return throw400Error("Name is required parameter", res);
    if (!username) return throw400Error("UserName is required parameter", res);
    if (!password) return throw400Error("Password is required parameter", res);

    isValidString(name, "Name");
    isValidString(username, "Username");
    isValidString(password, "Password");

    xss(name);
    xss(username);
    xss(password);

    const userName = username.toLowerCase();

    const hashPassword = await bcrypt.hash(password, 16);

    const userPayload = { name, username: userName, password: hashPassword };

    const userCreated = await users.create(userPayload);

    req.session.user = userCreated;

    return res.status(200).json({ status: true, user: userCreated });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

router.get("/logout", (req, res) => {
  try {
    if (req.session?.user) {
      req.session.destroy((err) => {
        if (err) {
          return res
            .status(400)
            .json({ status: true, user: "Unable to log out" });
        } else {
          res.clearCookie("AuthCookie");
          return res
            .status(200)
            .json({ status: true, user: "Logged out successfully" });
        }
      });
    } else {
      throw { status: 404, message: "Please login first!" };
    }
  } catch (error) {
    return handleCatchError(error, res);
  }
});

//Blog routes
router.get("/", async (req, res) => {
  try {
    const { skip, take } = req.query;
    const blogPayload = await blogs.get();
    let blogsData = [];

    if (!skip && !take) blogsData = blogPayload.slice(0, 20);

    if (skip && !take) {
      isValidPositiveNumber(skip, "Skip");
      blogsData = blogPayload.slice(skip, blogPayload.length).slice(0, 20);
    }

    if (!skip && take) {
      isValidPositiveNumber(take, "Take");
      blogsData = getTakeBlogPayload(take, blogPayload);
    }

    if (take && skip) {
      isValidPositiveNumber(skip, "Skip");
      isValidPositiveNumber(take, "Take");

      skipBlogsData = blogPayload.slice(skip, blogPayload.length);
      blogsData = getTakeBlogPayload(take, skipBlogsData);
    }

    return res.status(200).json({ status: true, blogs: blogsData });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return throw400Error("Id is required parameter", res);
    isValidString(id, "id");

    const parsedId = ObjectId.isValid(id);
    if (!parsedId)
      throw { status: 400, message: "Id passed is not a valid object id" };

    const blog = await blogs.getBlogById(id);
    return res.status(200).json({ status: true, blog });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, body } = req.body;
    const { user } = req.session;

    if (!user) throw { status: 403, message: "You are not authorized!" };
    if (!title) return throw400Error("Title is required parameter", res);
    if (!body) return throw400Error("Body is required parameter", res);

    isValidString(title, "Title");
    isValidString(body, "Body");

    xss(title);
    xss(body);

    const blogPayload = {
      title,
      body,
      userThatPosted: {
        _id: user?._id,
        username: user?.username.toLowerCase(),
      },
    };

    const blog = await blogs.create(blogPayload);
    return res.status(200).json({ status: true, blog });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, body } = req.body;
    const { id } = req.params;

    const { user } = req.session;

    if (!user) throw { status: 403, message: "You are not authorized!" };
    if (!title) return throw400Error("Title is required parameter", res);
    if (!body) return throw400Error("Body is required parameter", res);
    if (!id) return throw400Error("Id is required parameter", res);

    isValidString(id, "id");
    isValidString(title, "Title");
    isValidString(body, "Body");

    const parsedId = ObjectId.isValid(id);
    if (!parsedId)
      throw { status: 400, message: "Id passed is not a valid object id" };

    xss(title);
    xss(body);
    xss(id);

    // check if valid user
    const blog = await blogs.getBlogById(id);
    if (user?._id !== blog?.userThatPosted?._id.toString())
      throw { status: 403, message: "You are not authorized to make changes!" };

    const updatedBlog = {
      title,
      body,
      userThatPosted: blog?.userThatPosted,
      comments: blog?.comments,
      blogId: id,
    };

    const blogData = await blogs.update(updatedBlog);
    return res.status(200).json({ status: true, blog: blogData });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { title, body } = req.body;
    const { id } = req.params;

    const { user } = req.session;

    if (!user) throw { status: 403, message: "You are not authorized!" };
    if (!title && !body)
      return throw400Error(
        "Please supply at least one field, title or body with contents",
        res
      );
    if (!id) return throw400Error("Id is required parameter", res);

    isValidString(id, "id");
    if (title) isValidString(title, "Title");
    if (body) isValidString(body, "Body");

    const parsedId = ObjectId.isValid(id);
    if (!parsedId)
      throw { status: 400, message: "Id passed is not a valid object id" };

    xss(title);
    xss(body);
    xss(id);

    // check if valid user
    const blog = await blogs.getBlogById(id);
    if (user?._id !== blog?.userThatPosted?._id.toString())
      throw { status: 403, message: "You are not authorized to make changes!" };

    const patchBlog = {
      title: title ? title : blog?.title,
      body: body ? body : blog?.body,
      userThatPosted: blog?.userThatPosted,
      comments: blog?.comments,
      blogId: id,
    };

    const blogData = await blogs.update(patchBlog);
    return res.status(200).json({ status: true, blog: blogData });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

//Comments routes
router.post("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const { user } = req.session;

    if (!user) throw { status: 403, message: "You are not authorized!" };

    if (!id) return throw400Error("Id is required parameter", res);
    if (!comment) return throw400Error("Comment is required parameter", res);

    isValidString(id, "id");
    isValidString(comment, "Comment");

    const parsedId = ObjectId.isValid(id);
    if (!parsedId)
      throw { status: 400, message: "Id passed is not a valid object id" };

    xss(id);
    xss(comment);

    await blogs.getBlogById(id);

    const commentPayload = {
      comment,
      userThatPosted: {
        _id: user?._id,
        username: user?.username,
      },
      blogId: id,
    };

    const blogtData = await comments.create(commentPayload);
    return res.status(200).json({ status: true, blog: blogtData });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

router.delete("/:blogId/:commentId", async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const { user } = req.session;

    if (!user) throw { status: 403, message: "You are not authorized!" };

    if (!blogId) return throw400Error("Blog Id is required parameter", res);
    if (!commentId)
      return throw400Error("Comment Id is required parameter", res);

    isValidString(blogId, "Blog Id");
    isValidString(commentId, "Comment Id");

    const parsedBlogId = ObjectId.isValid(blogId);
    const parsedCommentId = ObjectId.isValid(commentId);

    if (!parsedBlogId)
      throw { status: 400, message: "Blog Id passed is not a valid object id" };
    if (!parsedCommentId)
      throw {
        status: 400,
        message: "Comment Id passed is not a valid object id",
      };

    // check if valid user
    const blog = await blogs.getBlogById(blogId);
    const [currComment] = blog?.comments.filter(
      (c) => c?._id.toString() === commentId
    );

    if (!currComment)
      throw { status: 404, message: "No comment is present with that id in this blog!" };

    if (user?._id !== currComment?.userThatPosted?._id.toString())
      throw { status: 403, message: "You are not authorized to make changes!" };

    const commentPayload = {
      blogId,
      commentId,
    };

    const commentData = await comments.remove(commentPayload);
    return res.status(200).json({ status: true, comment: commentData });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

module.exports = router;
