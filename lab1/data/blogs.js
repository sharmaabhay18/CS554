const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const blogs = mongoCollections.blogs;
const { isValidString } = require("../utils/helperFuctions");

const getBlogByObjectId = async (id) => {
  if (!id) throw { status: 400, message: "Id is required" };

  const parsedId = ObjectId.isValid(id);
  if (!parsedId)
    throw { status: 400, message: "Id passed is not a valid object id" };

  const blogsCollection = await blogs();
  const blog = await blogsCollection.findOne({ _id: id });

  if (blog === null)
    throw { status: 404, message: "No blog is present with that id" };

  return blog;
};

const getBlogById = async (id) => {
  if (!id) throw { status: 400, message: "Id is required" };
  isValidString(id, "Id");

  const parsedId = ObjectId.isValid(id);
  if (!parsedId)
    throw { status: 400, message: "Id passed is not a valid object id" };

  const blogsCollection = await blogs();
  const blog = await blogsCollection.findOne({ _id: ObjectId(id) });

  if (blog === null)
    throw { status: 404, message: "No blog is present with that id" };

  return blog;
};

const get = async () => {
  try {
    const blogsCollection = await blogs();
    const allBlogs = await blogsCollection.find({}).toArray();

    const blogPayload = allBlogs.map((blog) => {
      return { _id: blog?._id?.toString(), ...blog };
    });

    return blogPayload;
  } catch (error) {
    throw {
      status: 404,
      message: "Error while getting blog details",
    };
  }
};

const create = async (blogPayload) => {
  try {
    const {
      title,
      body,
      userThatPosted: { _id, username },
    } = blogPayload;

    if (!title) throw { status: 400, message: "Title is required parameter" };
    if (!body) throw { status: 400, message: "Body is required parameter" };
    if (!_id) throw { status: 400, message: "Id is required parameter" };
    if (!username)
      throw { status: 400, message: "Username is required parameter" };

    isValidString(title, "Title");
    isValidString(body, "Body");
    isValidString(_id, "Id");
    isValidString(username, "Username");

    const parsedUserId = ObjectId.isValid(_id);
    if (!parsedUserId)
      throw { status: 400, message: "User Id passed is not a valid object id" };

    const blogsPayload = {
      title,
      body,
      userThatPosted: { _id: ObjectId(_id), username },
      comments: [],
    };
    const blogsCollection = await blogs();

    const blogCreated = await blogsCollection.insertOne(blogsPayload);
    if (blogCreated.insertedCount === 0)
      throw { status: 409, message: "Could not create blog" };

    const blogId = blogCreated.insertedId;
    const retrievedBlog = await getBlogByObjectId(blogId);

    return {
      title: retrievedBlog.title,
      body: retrievedBlog.body,
      userThatPosted: retrievedBlog.userThatPosted,
      comments: retrievedBlog.comments,
      _id: retrievedBlog?._id?.toString(),
    };
  } catch (error) {
    throw {
      status: error.status,
      message: `Error while creating blog ${error.message}`,
    };
  }
};

const update = async (blogPayload) => {
  try {
    const {
      title,
      body,
      userThatPosted: { _id, username },
      comments,
      blogId,
    } = blogPayload;

    if (!title) throw { status: 400, message: "Title is required parameter" };
    if (!body) throw { status: 400, message: "Body is required parameter" };
    if (!_id) throw { status: 400, message: "Id is required parameter" };
    if (!username)
      throw { status: 400, message: "Username is required parameter" };
    if (!blogId)
      throw { status: 400, message: "Blog id is required parameter" };
    if (!comments)
      throw { status: 400, message: "Comments is required parameter" };

    isValidString(title, "Title");
    isValidString(body, "Body");
    isValidString(username, "Username");
    isValidString(blogId, "Blog Id");
    if (!Array.isArray(comments))
      throw { status: 400, message: "Comments should be of type array" };

    const parsedUserId = ObjectId.isValid(_id);
    const parsedId = ObjectId.isValid(blogId);

    if (!parsedUserId)
      throw { status: 400, message: "User Id passed is not a valid object id" };
    if (!parsedId)
      throw { status: 400, message: "Blog Id passed is not a valid object id" };

    const blogsPayload = {
      title,
      body,
      userThatPosted: { _id: ObjectId(_id), username },
      comments,
    };

    const blogsCollection = await blogs();
    const updatedBlog = await blogsCollection.updateOne(
      { _id: ObjectId(blogId) },
      { $set: blogsPayload }
    );

    if (!updatedBlog.matchedCount && !updatedBlog.modifiedCount)
      throw { status: 409, message: "Could not update blog" };

    return await getBlogById(blogId);
  } catch (error) {
    throw {
      status: error.status,
      message: `Error while updating blog ${error.message}`,
    };
  }
};

module.exports = {
  get,
  create,
  update,
  getBlogById,
};
