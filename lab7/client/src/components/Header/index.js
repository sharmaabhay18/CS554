import React from "react";
import PropTypes from "prop-types";
import { BiArrowBack } from "react-icons/bi";
import { useHistory } from "react-router-dom";

import Button from "../Button";
import style from "./header.module.scss";

const Header = ({ text, goBack, onHandlePage }) => {
  const history = useHistory();

  const handleClick = () => (goBack ? history.goBack() : history.replace("/"));
  return (
    <div className={style.headerContainer}>
      <div onClick={handleClick} className={style.backBtnContainer}>
        <BiArrowBack />
        {goBack ? <p>Back</p> : <p>Home</p>}
      </div>
      <h1>{text}</h1>
      <div className={style.btnContainer}>
        <Button
          text="Pokemon"
          onClick={() => {
            onHandlePage && onHandlePage();
            history.push("/pokemon/page/0");
          }}
        />
        <Button
          text="Pokemon Trainers"
          onClick={() => history.push("/trainers")}
        />
      </div>
    </div>
  );
};

Header.propTypes = {
  text: PropTypes.string,
  goBack: PropTypes.bool,
  onHandlePage: PropTypes.func,
};

export default Header;
