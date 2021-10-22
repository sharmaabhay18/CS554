import React from "react";
import { useHistory } from "react-router-dom";

import Button from "../../components/Button";
import styles from "./landingPage.module.scss";
import image from "../../assets/landing.jpg";

const LandingPage = () => {
  const history = useHistory();
  return (
    <div className={styles.landingContainer}>
      <img alt="landing" src={image} />
      <div className={styles.boxStyle}>
        <h1 className={styles.mainHeading}>MARVEL WORLD</h1>
        <h2 className={styles.subHeading}>
          Get hooked on a hearty helping of heroes and villains from the humble
          House of Ideas!
        </h2>
        <div className={styles.btnContainer}>
          <Button text="Home" onClick={() => history.push("/")} />
          <Button
            text="Characters"
            onClick={() => history.push("/characters/page/0")}
          />
          <Button
            text="Comics"
            onClick={() => history.push("/comics/page/0")}
          />
          <Button
            text="Series"
            onClick={() => history.push("/series/page/0")}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
