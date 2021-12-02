import { gql } from "@apollo/client";

const POKEMON_BY_PAGE = gql`
query GetPokemon($pageNum: Int!) {
  pokemon(pageNum: $pageNum) {
    count,
    pokemon {
      image,
      name,
      url,
      id
    }
  }
}
`;

const POKEMON_BY_ID = gql`
query GetPokemonById($id: Int!) {
    pokemonById(id: $id) {
      name,
      id,
      avatar,
      types,
      abilities,
      moves,
      images {
        backDefault,
        backShiny,
        frontDefault,
        frontShiny
      }
    }
}
`;

export { POKEMON_BY_PAGE, POKEMON_BY_ID };
