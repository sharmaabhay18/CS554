import React from "react";
import PropTypes from "prop-types";
import Button from "../../components/Button";
import styles from "./card.module.scss";

const Card = ({ title, img, onClick, handleBtnClick, btnText }) => {
  return (
    <div className={styles.cardContainer} onClick={onClick}>
      <img src={img} alt="img" className={styles.imgStyle} />
      <h1>{title}</h1>
      <Button
        text={btnText}
        onClick={(e) => {
          e.stopPropagation();
          handleBtnClick();
        }}
      />
      <br />
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  img: PropTypes.string,
  onClick: PropTypes.func,
  handleBtnClick: PropTypes.func,
  btnText: PropTypes.string,
};

export default Card;
