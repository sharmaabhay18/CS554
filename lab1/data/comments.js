const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const blogs = mongoCollections.blogs;
const { isValidString } = require("../utils/helperFuctions");
const { getBlogById } = require("./blogs");

const create = async (commentPayload) => {
  try {
    const {
      comment,
      userThatPosted: { _id, username },
      blogId,
    } = commentPayload;

    if (!comment)
      throw { status: 400, message: "Comment is required parameter" };
    if (!_id) throw { status: 400, message: "Id is required parameter" };
    if (!blogId)
      throw { status: 400, message: "Blog Id is required parameter" };
    if (!username)
      throw { status: 400, message: "Username is required parameter" };

    isValidString(comment, "Comment");
    isValidString(_id, "Id");
    isValidString(username, "Username");
    isValidString(blogId, "Blog Id");

    const parsedUserId = ObjectId.isValid(_id);
    if (!parsedUserId)
      throw { status: 400, message: "User Id passed is not a valid object id" };

    const parsedBlogId = ObjectId.isValid(blogId);
    if (!parsedBlogId)
      throw { status: 400, message: "Blog Id passed is not a valid object id" };

    const commentId = ObjectId();

    const commentData = {
      _id: commentId,
      comment,
      userThatPosted: { _id: ObjectId(_id), username },
    };

    const blogsCollection = await blogs();
    const pushedComment = await blogsCollection.updateOne(
      { _id: ObjectId(blogId) },
      {
        $push: { comments: commentData },
      }
    );

    if (!pushedComment.matchedCount && !pushedComment.modifiedCount)
      throw { status: 409, message: "Could not push comments in blog" };

    return await getBlogById(blogId);
  } catch (error) {
    throw {
      status: error.status,
      message: `Error while adding comment ${error.message}`,
    };
  }
};

const remove = async (commentPayload) => {
  try {
    const { blogId, commentId } = commentPayload;
    if (!commentId)
      throw { status: 400, message: "Comment Id is required parameter" };
    if (!blogId)
      throw { status: 400, message: "Blog Id is required parameter" };

    isValidString(blogId, "blogId");
    isValidString(commentId, "commentId");

    const parsedBlogId = ObjectId.isValid(blogId);
    const parsedCommentId = ObjectId.isValid(commentId);

    if (!parsedBlogId)
      throw { status: 400, message: "Blog Id passed is not a valid object id" };
    if (!parsedCommentId)
      throw {
        status: 400,
        message: "Comment Id passed is not a valid object id",
      };

    const blogsCollection = await blogs();

    const deletedComment = await blogsCollection.updateOne(
      { _id: ObjectId(blogId) },
      { $pull: { comments: { _id: ObjectId(commentId) } } }
    );

    if (!deletedComment.modifiedCount)
      throw {
        status: 400,
        message: "Could not remove comment!",
      };

    return { commentId, deleted: true };
  } catch (error) {
    throw {
      status: error.status,
      message: `Error while removing comment: ${error.message}`,
    };
  }
};

module.exports = {
  create,
  remove,
};
