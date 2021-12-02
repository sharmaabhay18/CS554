import React from "react";
import { useHistory } from "react-router-dom";

import Button from "../Button";
import style from "./error.module.scss";

function Error() {
  const history = useHistory();
  return (
    <React.Fragment>
      <div className={style.errorContainer}>
        <h1>Error Resource Not Found</h1>
        <p>No data/route available... the sadness.</p>
        <Button text="Go Home" onClick={() => history.replace("/")} />
      </div>
    </React.Fragment>
  );
}

export default Error;
