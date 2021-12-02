const { ApolloServer, gql } = require("apollo-server");
const { ApolloError } = require("apollo-server-errors");
const axios = require("axios");
const bluebird = require("bluebird");
const redis = require("redis");

const { getPokemonPagination, getPokemonById } = require("./api");

const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const typeDefs = gql`
  type Image {
    backDefault: String
    frontDefault: String
    backShiny: String
    frontShiny: String
  }

  type PokemonScehma {
    id: Int!
    name: String!
    url: String!
    image: String
  }

  type Pokemon {
    pokemon: [PokemonScehma]
    count: Int
  }

  type PokemonDetails {
    name: String!
    avatar: String
    abilities: [String]
    moves: [String]
    types: [String]
    images: Image
    id: Int
  }

  type Query {
    pokemon(pageNum: Int): Pokemon
    pokemonById(id: Int): PokemonDetails
  }
`;

const resolvers = {
  Query: {
    pokemon: async (_, args) => {
      if (args.pageNum === undefined) {
        throw new UserInputError("Please enter valid page num");
      }
      if (isNaN(args.pageNum)) {
        throw new UserInputError("Page num should be of type number");
      }

      const calOffset = args.pageNum * 20;
      const pokCounter = `pokemon-${calOffset}`;
      const isPageCached = await client.existsAsync(pokCounter);

      if (isPageCached) {
        console.log("Getting pokemon from cache!");
        const pokemonPayload = await client.getAsync(pokCounter);
        return JSON.parse(pokemonPayload);
      }

      const pokemonData = await getPokemonPagination(calOffset);
      const pokData = await Promise.all(
        pokemonData.results.map(async (pok) => {
          try {
            const { data } = await axios.get(pok.url);
            const imageObj = data?.sprites?.other;
            const image = imageObj["official-artwork"].front_default;

            return {
              name: pok.name,
              url: pok.url,
              image: image ? image : data?.sprites?.front_default,
              id: data?.id,
            };
          } catch (error) {
            throw new ApolloError(
              "Something went wrong on the 3rd party api",
              503
            );
          }
        })
      );

      if (pokData.length === 0) throw new ApolloError("No Pokemon Found", 404);

      const finalPayload = {
        pokemon: pokData,
        count: pokemonData?.count,
      };

      await client.setAsync(pokCounter, JSON.stringify(finalPayload));
      console.log("Caching all pokemon");

      return finalPayload;
    },
    pokemonById: async (_, args) => {
      const id = args?.id;
      if (id === undefined || id < 0) {
        throw new UserInputError("Please enter valid Id");
      }
      if (isNaN(id)) {
        throw new UserInputError("Id should be of type number");
      }

      const pokIdCounter = `pokemon-id-${id}`;
      const isPageCached = await client.existsAsync(pokIdCounter);

      if (isPageCached) {
        console.log("Getting pokemon details from cache!");
        const pokemonDetail = await client.getAsync(pokIdCounter);
        return JSON.parse(pokemonDetail);
      }

      const pokemonPayload = await getPokemonById(id);

      const imageObj = pokemonPayload?.sprites?.other;
      const avatar = imageObj["official-artwork"].front_default;
      const images = {
        backDefault: pokemonPayload?.sprites?.back_default,
        frontDefault: pokemonPayload?.sprites?.front_default,
        backShiny: pokemonPayload?.sprites?.back_shiny,
        frontShiny: pokemonPayload?.sprites?.front_shiny,
      };

      const pokemonDetails = {
        name: pokemonPayload.name,
        avatar: avatar ? avatar : pokemonPayload?.sprites?.front_default,
        abilities: pokemonPayload.abilities.map((i) => i?.ability?.name),
        moves: pokemonPayload.moves.map((i) => i?.move?.name),
        types: pokemonPayload.types.map((i) => i?.type?.name),
        images,
        id: id,
      };

      await client.setAsync(pokIdCounter, JSON.stringify(pokemonDetails));
      console.log("Caching all pokemon details");

      return pokemonDetails;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
