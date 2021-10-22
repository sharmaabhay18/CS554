import React, { useEffect, useState } from "react";

import Search from "../../components/SearchBar";
import Error from "../../components/Error";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import Header from "../../components/Header";
import Card from "../../components/Card";
import { calPageCount } from "../../utils/helperFunction";
import { useAxios } from "../../utils/useAxios";
import { getCharacterList } from "../../config/api";
import styles from "./characters.module.scss";

const Characters = (props) => {
  const {
    history,
    match: {
      params: { id },
    },
  } = props;
  const parsedId = parseInt(id);
  const initialPageOffset = parsedId * 20;

  const [characterPayload, setCharacterPayload] = useState([]);
  const [pageOffset, setPageOffset] = useState(initialPageOffset);
  const [pagination, setPagination] = useState(parsedId);
  const [searchText, setSearchText] = useState("");

  const { response, loading, error } = useAxios(
    {
      method: "get",
      url: getCharacterList(!isNaN(pageOffset) ? pageOffset : -1, searchText),
    },
    !isNaN(pageOffset) ? pageOffset : -1,
    searchText
  );
  // console.log("pageOffset", response.results.length === 0 && searchText.length !== 0);
  useEffect(() => {
    if (response !== null) {
      history.push(`/characters/page/${pagination}`);
      setCharacterPayload(response?.results);
    }
  }, [response, pagination, history]);

  const handlePageClick = async ({ selected }) => {
    if (parsedId !== selected) {
      const calPagination = selected * 20;
      setPagination(selected);
      setPageOffset(calPagination);
    }
  };

  const handleClick = (c) => history.push(`/characters/${c.id}`, { params: c });

  const handleSearchChange = (e) => {
    setPagination(0);
    setPageOffset(0);
    setSearchText(e.target.value);
  };
  console.log("error", error);
  return (
    <React.Fragment>
      {error ? (
        <Error />
      ) : (
        <React.Fragment>
          <Spinner loading={loading} />
          <Header text="MARVEL CHARACTERS" />
          <Search searchText={searchText} onChange={handleSearchChange} />
          <Pagination
            pageCount={calPageCount(response)}
            handlePageClick={handlePageClick}
            forcePagination={pagination}
          />
          {response && response.results.length === 0 ? (
            <div className={styles.notFound}>
              <h1>Oops! No result found.</h1>
            </div>
          ) : (
            <React.Fragment>
              <div className={styles.characterContainer}>
                {characterPayload &&
                  characterPayload.map((c) => (
                    <Card
                      onClick={() => handleClick(c)}
                      key={c.id}
                      title={c.name}
                      img={`${c.thumbnail.path}.${c.thumbnail.extension}`}
                      description={c.description}
                    />
                  ))}
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Characters;
