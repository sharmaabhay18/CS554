import React from "react";
import PropTypes from "prop-types";
import { BiArrowBack } from "react-icons/bi";
import { useHistory } from "react-router-dom";

import Button from "../Button";
import style from "./header.module.scss";

const Header = ({ text, goBack }) => {
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
          text="Characters"
          onClick={() => history.push("/characters/page/0")}
        />
        <Button text="Comics" onClick={() => history.push("/comics/page/0")} />
        <Button text="Series" onClick={() => history.push("/series/page/0")} />
      </div>
    </div>
  );
};

Header.propTypes = {
  text: PropTypes.string,
  goBack: PropTypes.bool,
};

export default Header;
