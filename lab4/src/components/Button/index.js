import React from "react";
import PropTypes from "prop-types";

import style from "./button.module.scss";

const Button = ({ text, onClick, isHoverBorder }) => {
  return (
    <button
      style={isHoverBorder && { border: "1px solid rgb(163, 0, 0)" }}
      onClick={onClick}
      className={style.buttonStyle}
    >
      {text}
    </button>
  );
};

export default Button;

Button.propTypes = {
  text: PropTypes.string,
  isHoverBorder: PropTypes.bool,
  onClick: PropTypes.func,
};
