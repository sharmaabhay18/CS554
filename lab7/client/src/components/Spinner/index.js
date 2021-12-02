import React from "react";
import PropTypes from "prop-types";
import Loader from "react-loader-spinner";

import styles from "./spinner.module.scss";

const Spinner = ({ loading }) => {
  return (
    <React.Fragment>
      {loading && (
        <div className={styles.loaderContianer}>
          <div className={styles.loaderChildContianer}>
            <Loader
              type="Puff"
              color="#00BFFF"
              height={100}
              width={100}
              timeout={3000}
            />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

Spinner.propTypes = {
  loading: PropTypes.bool,
};

export default Spinner;
