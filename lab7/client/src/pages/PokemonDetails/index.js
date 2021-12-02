import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { connect } from "react-redux";

import Spinner from "../../components/Spinner";
import Button from "../../components/Button";
import Header from "../../components/Header";
import styles from "./pokemonDetails.module.scss";
import { updateTrainerAction } from "../../redux/actions/";

import { POKEMON_BY_ID } from "../../config/query";

const PokemonDetails = (props) => {
  const {
    match: {
      params: { id },
    },
    trainer,
  } = props;

  const getText = () => {
    let text = "Catch";
    const [selectedTrainer] = trainer.filter((i) => i.isSelected === true);
    if (selectedTrainer && selectedTrainer.length !== 0) {
      const ids = selectedTrainer.pokemons.map((i) => i.id);
      if (selectedTrainer.pokemons.length >= 6) {
        text = "Party Full";
      }
      ids.forEach((id) => {
        if (id === parsedID) {
          text = "Release";
        }
      });
    }
    return text;
  };

  const parsedID = parseInt(id);
  const [buttonText, setButtonText] = useState(getText());
  const { loading, error, data } = useQuery(POKEMON_BY_ID, {
    variables: { id: parsedID },
    fetchPolicy: "network-only",
  });

  const handleBtn = () => {
    if (trainer && trainer.length === 0) {
      return window.alert("Please add and select trainer");
    }

    const isTrainerAva = trainer.every((i) => i.isSelected === false);

    if (isTrainerAva) {
      return window.alert("Please add and select trainer");
    }

    let newTrainer = trainer.map((i) => {
      if (i.isSelected) {
        const isPresent = i.pokemons.filter((f) => f.id === parsedID);
        if (isPresent.length !== 0 && isPresent[0].btnText === "Release") {
          const newVal = i.pokemons.filter((l) => l.id !== parsedID);
          i.pokemons = newVal;
          setButtonText("Catch");
        } else if (isPresent.length === 0 && i.pokemons.length < 6) {
          data.pokemonById["btnText"] = "Release";
          setButtonText("Release");
          i.pokemons.push(data.pokemonById);
        }
        return i;
      }
      return i;
    });
    updateTrainerAction(newTrainer);
  };
  return (
    <React.Fragment>
      <Spinner loading={loading} />
      <Header text={data && data.pokemonById.name} goBack={true} />
      {error ? (
        <div className={styles.notFound}>
          <h1>Oops! No Pokemon Detail found.</h1>
        </div>
      ) : (
        <div className={styles.pokemonContainer}>
          <div className={styles.rowContainer}>
            {data &&
              data.pokemonById.types.map((item) => {
                return (
                  <div key={item} className={styles.typeContainer}>
                    <p>{item}</p>
                  </div>
                );
              })}
          </div>
          <img
            src={data && data.pokemonById.avatar}
            alt="img"
            className={styles.imgStyle}
          />

          <div className={styles.imageContainer}>
            {data && data.pokemonById.images.frontDefault && (
              <img
                src={data && data.pokemonById.images.frontDefault}
                alt="img"
                className={styles.imgSmallStyle}
              />
            )}
            {data && data.pokemonById.images.backDefault && (
              <img
                src={data && data.pokemonById.images.backDefault}
                alt="img"
                className={styles.imgSmallStyle}
              />
            )}
            {data && data.pokemonById.images.frontShiny && (
              <img
                src={data && data.pokemonById.images.frontShiny}
                alt="img"
                className={styles.imgSmallStyle}
              />
            )}
            {data && data.pokemonById.images.backShiny && (
              <img
                src={data && data.pokemonById.images.backShiny}
                alt="img"
                className={styles.imgSmallStyle}
              />
            )}
          </div>
          <Button text={buttonText} onClick={() => handleBtn()} />
          <div className={styles.colContainer}>
            <h1>Abilities</h1>
            <div className={styles.rowContainer}>
              {data &&
                data.pokemonById.abilities.map((item, index) => {
                  let val = `${item},`;
                  if (index === data.pokemonById.abilities.length - 1) {
                    val = `${item}.`;
                  }
                  return (
                    <div key={item} className={styles.abContainer}>
                      <p>{val}</p>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className={styles.colContainer}>
            <h1>Moves</h1>
            <div className={styles.movesContainer}>
              {data && data.pokemonById.moves.length !== 0 ? (
                data.pokemonById.moves.map((item, index) => {
                  let val = `${item},`;
                  if (index === data.pokemonById.moves.length - 1) {
                    val = `${item}.`;
                  }
                  return (
                    <div key={item} className={styles.moContainer}>
                      <p className={styles.moContainerPara}>{val}</p>
                    </div>
                  );
                })
              ) : (
                <p className={styles.moContainerPara}>NA</p>
              )}
            </div>
          </div>
        </div>
      )}
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

export default connect(mapStateToProps, mapDispatchToProps)(PokemonDetails);
