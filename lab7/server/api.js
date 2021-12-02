const axios = require("axios");

const getPokemonPagination = async (offset) => {
  try {
    const { data, status } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${offset}`
    );
    if (status === 200) {
      return data;
    } else {
      throw { message: "Pokemon Api returned status other than 200" };
    }
  } catch (error) {
    throw {
      status: 500,
      message: `Something went wrong while fetching pokemon. ${error}`,
    };
  }
};

const getPokemonById = async (id) => {
  try {
    const { data, status } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${id}`
    );
    if (status === 200) {
      return data;
    } else {
      throw {
        message: `Pokemon Api returned status other than 200`,
      };
    }
  } catch (error) {
    throw {
      status: 404,
      message: `No show found by given ID. ${error}`,
    };
  }
};

module.exports = {
  getPokemonPagination,
  getPokemonById,
};
