import React, { useEffect, useState } from "react";

import Search from "../../components/SearchBar";
import Error from "../../components/Error";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import Header from "../../components/Header";
import Card from "../../components/Card";
import { calPageCount } from "../../utils/helperFunction";
import { useAxios } from "../../utils/useAxios";
import { getComicsList } from "../../config/api";
import styles from "./comics.module.scss";

const Comics = (props) => {
  const {
    history,
    match: {
      params: { id },
    },
  } = props;
  const parsedId = parseInt(id);
  const initialPageOffset = parsedId * 20;

  const [comicsPayload, setComicsPayload] = useState([]);
  const [pageOffset, setPageOffset] = useState(initialPageOffset);
  const [pagination, setPagination] = useState(parsedId);
  const [searchText, setSearchText] = useState("");

  const { response, loading, error } = useAxios(
    {
      method: "get",
      url: getComicsList(!isNaN(pageOffset) ? pageOffset : -1, searchText),
    },
    !isNaN(pageOffset) ? pageOffset : -1,
    searchText
  );

  useEffect(() => {
    if (response !== null) {
      history.push(`/comics/page/${pagination}`);
      setComicsPayload(response?.results);
    }
  }, [response, pagination, history]);

  const handlePageClick = async ({ selected }) => {
    if (parsedId !== selected) {
      const calPagination = selected * 20;
      setPagination(selected);
      setPageOffset(calPagination);
    }
  };

  const handleClick = (c) => history.push(`/comics/${c.id}`, { params: c });

  const handleSearchChange = (e) => {
    setPagination(0);
    setPageOffset(0);
    setSearchText(e.target.value);
  };

  return (
    <React.Fragment>
      {error ? (
        <Error />
      ) : (
        <React.Fragment>
          <Spinner loading={loading} />
          <Header text="MARVEL COMICS" />
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
              <div className={styles.comicsContainer}>
                {comicsPayload &&
                  comicsPayload.map((c) => (
                    <Card
                      onClick={() => handleClick(c)}
                      key={c.id}
                      title={c.title}
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

export default Comics;
