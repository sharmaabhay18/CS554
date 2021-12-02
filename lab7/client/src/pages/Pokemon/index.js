import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { connect } from "react-redux";
import { calPageCount } from "../../utils/helperFunction";

import Spinner from "../../components/Spinner";
import Header from "../../components/Header";
import Pagination from "../../components/Pagination";
import Card from "../../components/Card";

import styles from "./pokemon.module.scss";
import { POKEMON_BY_PAGE } from "../../config/query";

import { updateTrainerAction } from "../../redux/actions/";

const Pokemon = (props) => {
  const {
    history,
    match: {
      params: { pagenum },
    },
    trainer,
    updateTrainerAction,
  } = props;

  const parsedPagenum = parseInt(pagenum);

  const [pokemonPayload, setPokemonPayload] = useState([]);
  const [pagination, setPagination] = useState(parsedPagenum);

  const { loading, error, data } = useQuery(POKEMON_BY_PAGE, {
    variables: { pageNum: pagination },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data !== undefined) {
      history.push(`/pokemon/page/${pagination}`);
      const pokemonPayload = data?.pokemon;
      setPokemonPayload(pokemonPayload);
    }
  }, [data, pagination, parsedPagenum, history, error, trainer]);

  const handlePageClick = async ({ selected }) => {
    if (parsedPagenum !== selected) {
      setPagination(selected);
    }
  };

  const onHandlePage = () => setPagination(0);
  const handleClick = (c) => history.push(`/pokemon/${c.id}`);
  const getText = (pokemon) => {
    let text = "Catch";
    const [selectedTrainer] = trainer.filter((i) => i.isSelected === true);
    if (selectedTrainer && selectedTrainer.length !== 0) {
      const ids = selectedTrainer.pokemons.map((i) => i.id);
      if (selectedTrainer.pokemons.length >= 6) {
        text = "Party Full";
      }
      ids.forEach((id) => {
        if (id === pokemon.id) {
          text = "Release";
        }
      });
    }
    return text;
  };

  return (
    <React.Fragment>
      <React.Fragment>
        <Spinner loading={loading} />
        <Header
          text="Pokemon! Go Catch them all :)"
          onHandlePage={onHandlePage}
        />
        <Pagination
          pageCount={calPageCount(pokemonPayload && pokemonPayload.count)}
          handlePageClick={handlePageClick}
          forcePagination={pagination}
        />
        {error ? (
          <div className={styles.notFound}>
            <h1>Oops! No Pokemon found.</h1>
          </div>
        ) : (
          <div className={styles.pokemonContainer}>
            {pokemonPayload &&
              pokemonPayload.pokemon &&
              pokemonPayload.pokemon.map((c) => {
                return (
                  <Card
                    onClick={() => handleClick(c)}
                    key={c.id}
                    title={c.name}
                    img={c.image}
                    btnText={getText(c)}
                    handleBtnClick={() => {
                      if (trainer && trainer.length === 0) {
                        return window.alert("Please add and select trainer");
                      }

                      const isTrainerAva = trainer.every(
                        (i) => i.isSelected === false
                      );

                      if (isTrainerAva) {
                        return window.alert("Please add and select trainer");
                      }

                      let newTrainer = trainer.map((i) => {
                        if (i.isSelected) {
                          const isPresent = i.pokemons.filter(
                            (f) => f.id === c.id
                          );

                          if (
                            c?.btnText === "Release" &&
                            isPresent.length !== 0
                          ) {
                            const newVal = i.pokemons.filter(
                              (l) => l.id !== c.id
                            );
                            i.pokemons = newVal;
                          } else if (
                            isPresent.length === 0 &&
                            i.pokemons.length < 6
                          ) {
                            c["btnText"] = "Release";
                            i.pokemons.push(c);
                          }
                          return i;
                        }
                        return i;
                      });

                      let newPokData = pokemonPayload;
                      newTrainer.forEach((trainer) => {
                        if (trainer.isSelected) {
                          trainer.pokemons.forEach((trainerPokemon) => {
                            newPokData.pokemon = pokemonPayload.pokemon.map(
                              (pok) => {
                                if (pok.id === trainerPokemon.id) {
                                  pok["btnText"] = "Release";
                                  return pok;
                                }
                                if (trainer.pokemons.length >= 6) {
                                  if (!pok["btnText"]) {
                                    pok["btnText"] = "Party Full";
                                    return pok;
                                  }
                                }
                                return pok;
                              }
                            );
                          });
                        }
                      });
                      setPokemonPayload(newPokData);
                      updateTrainerAction(newTrainer);
                    }}
                  />
                );
              })}
          </div>
        )}
      </React.Fragment>
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  updateTrainerAction,
};

const mapStateToProps = ({ trainerReducer }) => {
  return {
    trainer: trainerReducer?.payload,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Pokemon);
