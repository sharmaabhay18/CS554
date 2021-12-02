import React, { useState } from "react";
import { connect } from "react-redux";
import { uuid } from "uuidv4";

import Header from "../../components/Header";
import Button from "../../components/Button";
import styles from "./trainer.module.scss";
import {
  addTrainerAction,
  selectTrainerAction,
  deleteTrainerAction,
} from "../../redux/actions/";

const Trainer = ({
  addTrainerAction,
  trainer,
  selectTrainerAction,
  deleteTrainerAction,
  history,
}) => {
  const [textBarVisible, setTextBarVisible] = useState(false);
  const [trainerText, setTrainerText] = useState("");

  const handleSelectTrainer = (t) => {
    const newTrainerPayload = trainer.map((item) => {
      if (item.id === t.id) {
        t.isSelected = true;
        return t;
      }
      item.isSelected = false;
      return item;
    });
    selectTrainerAction(newTrainerPayload);
  };

  const handleDeleteTrainer = (t) => {
    const newTrainerPayload = trainer.filter((i) => i.id !== t.id);
    deleteTrainerAction(newTrainerPayload);
  };

  return (
    <div>
      <Header text="Trainers" goBack={true} />
      <div className={styles.alignCenter}>
        <div className={styles.rowBtnContainer}>
          <Button text="Add Trainer" onClick={() => setTextBarVisible(true)} />
        </div>
        {textBarVisible && (
          <form
            className={styles.formStyle}
            onSubmit={(e) => {
              e.preventDefault();
              const newTrainer = {
                id: uuid(),
                name: trainerText,
                isSelected: false,
                pokemons: [],
              };

              const trainerPayload = trainer;
              trainerPayload.push(newTrainer);
              addTrainerAction(trainerPayload);
              window.alert(`Trainer ${trainerText} Added!`);
              setTrainerText("");
              setTextBarVisible(false);
            }}
          >
            <input
              id="searchBar"
              type="text"
              placeholder="Type here..."
              required
              className={styles.textStyle}
              value={trainerText}
              onChange={(e) => setTrainerText(e.target.value)}
              autoComplete="off"
            />
            <input value="Submit" type="submit" className={styles.submitBtn} />
          </form>
        )}
      </div>
      <div>
        {trainer &&
          trainer.map((i, index) => {
            return (
              <div key={index}>
                {i.isSelected ? (
                  <div className={styles.alignCenter}>
                    <div className={styles.rowContainer}>
                      <h2>Trainer: {i.name}</h2>
                      <Button text="Selected" onClick={() => {}} />
                    </div>
                    <div className={styles.imageCenter}>
                      {i.pokemons.map((pk) => (
                        <div
                          className={styles.card}
                          onClick={() => history.push(`/pokemon/${pk.id}`)}
                        >
                          <img
                            src={pk.avatar ? pk.avatar : pk.image}
                            alt="img"
                            className={styles.imgStyle}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={styles.trainerContaier}>
                    <h2>Trainer: {i.name}</h2>
                    <Button
                      text="Delete Trainer"
                      onClick={() => handleDeleteTrainer(i)}
                    />
                    <Button
                      text="Select Trainer"
                      onClick={() => handleSelectTrainer(i)}
                    />
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  addTrainerAction,
  selectTrainerAction,
  deleteTrainerAction,
};

const mapStateToProps = ({ trainerReducer }) => {
  return {
    trainer: trainerReducer?.payload,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Trainer);
