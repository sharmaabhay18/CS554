import React, { useEffect, useState } from "react";

import { getCharacterById } from "../../config/api";
import { useAxios } from "../../utils/useAxios";
import Spinner from "../../components/Spinner";
import Button from "../../components/Button";
import Header from "../../components/Header";
import styles from "./characterDetails.module.scss";

const CharacterDetails = (props) => {
  const {
    history,
    match: { params },
    location: { state },
  } = props;

  const { response, loading, error } = useAxios(
    {
      method: "get",
      url: getCharacterById(params && params.id),
    },
    null
  );

  const [payload, setPayload] = useState(
    state && state.params ? state.params : []
  );

  useEffect(() => {
    if (error || isNaN(params && params.id)) history.replace("/404");
    if (response !== null) {
      setPayload(response?.results[0]);
    }
  }, [response, history, payload, error, params]);

  return (
    <React.Fragment>
      <Spinner loading={loading} />
      <Header text={payload.name} goBack={true} />
      {!loading && (
        <div className={styles.detailContainer}>
          <div className={styles.detailSubContainer}>
            <div style={{ marginTop: "20px" }}>
              <h1 className={styles.titleStyle}>{payload.name}</h1>
              <img
                src={`${payload.thumbnail.path}.${payload.thumbnail.extension}`}
                alt="img"
                className={styles.imgStyle}
              />
              <div className={styles.rowStyle}>
                <h1>
                  Available Comics : <span> {payload.comics.available}</span>
                </h1>
              </div>
              <div className={styles.rowStyle}>
                <h1>
                  Available Series : <span> {payload.series.available}</span>
                </h1>
              </div>
              <div className={styles.rowStyle}>
                <h1>
                  Available Stories : <span> {payload.stories.available}</span>
                </h1>
              </div>
              <div className={styles.rowStyle}>
                <h1>
                  Description :{" "}
                  <span>
                    {" "}
                    {payload.description
                      ? payload.description
                      : "No Description Available!"}
                  </span>
                </h1>
              </div>
            </div>
            <div
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                isHoverBorder={true}
                text="Go Back"
                onClick={() => history.goBack()}
              />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default CharacterDetails;
