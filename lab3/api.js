const axios = require("axios");

const allShows = async () => {
  try {
    const { data, status } = await axios.get(`http://api.tvmaze.com/shows`);
    if (status === 200) {
      return data;
    } else {
      throw "TV Maze Api returned status other than 200";
    }
  } catch (error) {
    throw `Something went wrong while fetching shows. ${error}`;
  }
};

const findShows = async (searchValue) => {
  try {
    const { data, status } = await axios.get(
      `http://api.tvmaze.com/search/shows?q=${searchValue}`
    );
    if (status === 200) {
      return data;
    } else {
      throw "TV Maze Api returned status other than 200";
    }
  } catch (error) {
    throw `Something went wrong while fetching shows. ${error}`;
  }
};

const getShowById = async (id) => {
  try {
    const { data, status } = await axios.get(
      `http://api.tvmaze.com/shows/${id}`
    );
    if (status === 200) {
      return data;
    } else {
      throw "TV Maze Api returned status other than 200";
    }
  } catch (error) {
    throw `No show found by given ID. ${error}`;
  }
};

module.exports = {
  findShows,
  getShowById,
  allShows,
};
