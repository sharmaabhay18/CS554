const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { isValidString } = require("../utils/helperFuctions");

const getUserByObjectId = async (id) => {
  if (!id) throw { status: 400, message: "Id is required" };

  const parsedId = ObjectId.isValid(id);
  if (!parsedId)
    throw { status: 400, message: "Id passed is not a valid object id" };

  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: id });
  if (user === null)
    throw { status: 404, message: "No user is present with that id" };

  return user;
};

const getUserByUserName = async (username) => {
  try {
    if (!username)
      throw { status: 400, message: "UserName is required parameter" };
    isValidString(username, "username");

    const usersCollection = await users();
    const user = await usersCollection.findOne({ username });

    if (user === null)
      throw { status: 401, message: "Username does not exist!" };

    user._id = user._id.toString();

    return user;
  } catch (error) {
    throw {
      status: error.status,
      message: `${error.message}`,
    };
  }
};

const create = async (userPayload) => {
  try {
    const { name, username, password } = userPayload;
    if (!name) throw { status: 400, message: "Name is required parameter" };
    if (!username)
      throw { status: 400, message: "UserName is required parameter" };
    if (!password)
      throw { status: 400, message: "Password is required parameter" };

    isValidString(name, "name");
    isValidString(username, "username");
    isValidString(password, "password");

    //check if username is already present in the system
    const usersCollection = await users();
    const user = await usersCollection.findOne({ username: username });
    if (user !== null)
      throw { status: 409, message: "Username already exist!" };

    const userCreated = await usersCollection.insertOne(userPayload);
    if (userCreated.insertedCount === 0)
      throw { status: 409, message: "Could not create user" };

    const newId = userCreated.insertedId;

    const retrievedUser = await getUserByObjectId(newId);

    return {
      name: retrievedUser.name,
      username: retrievedUser.username,
      _id: retrievedUser?._id?.toString(),
    };
  } catch (error) {
    throw {
      status: error.status,
      message: `Error while creating user ${error.message}`,
    };
  }
};

module.exports = {
  create,
  getUserByUserName,
};
