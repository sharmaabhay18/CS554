import React from "react";
import PropTypes from "prop-types";

import styles from "./card.module.scss";

const Card = ({ title, img, description, onClick }) => {
  return (
    <div className={styles.cardContainer} onClick={onClick}>
      <img src={img} alt="img" className={styles.imgStyle} />
      <h1>{title}</h1>
      <hr className={styles.lineStyle} />
      <p className={styles.descriptionStyle}>
        {description ? description : "No description found!"}
      </p>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  img: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func,
};

export default Card;
