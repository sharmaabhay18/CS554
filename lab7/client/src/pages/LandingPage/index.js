import React from "react";
import { useHistory } from "react-router-dom";

import Button from "../../components/Button";
import styles from "./landingPage.module.scss";
import image from "../../assets/landing.jpeg";

const LandingPage = () => {
  const history = useHistory();
  return (
    <div className={styles.landingContainer}>
      <img alt="landing" src={image} />
      <div className={styles.boxStyle}>
        <h1 className={styles.mainHeading}>POKEMON WORLD</h1>
        <h2 className={styles.subHeading}>Go Catch them all!</h2>
        <div className={styles.btnContainer}>
          <Button
            text="Pokemon"
            onClick={() => history.push("/pokemon/page/0")}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
