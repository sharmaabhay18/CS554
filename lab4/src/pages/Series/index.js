import React, { useEffect, useState } from "react";

import Search from "../../components/SearchBar";
import Error from "../../components/Error";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import Header from "../../components/Header";
import Card from "../../components/Card";
import { useAxios } from "../../utils/useAxios";
import { calPageCount } from "../../utils/helperFunction";
import { getSeriesList } from "../../config/api";
import styles from "./series.module.scss";

const Series = (props) => {
  const {
    history,
    match: {
      params: { id },
    },
  } = props;
  const parsedId = parseInt(id);
  const initialPageOffset = parsedId * 20;

  const [seriesPayload, setSeriesPayload] = useState([]);
  const [pagination, setPagination] = useState(parsedId);
  const [pageOffset, setPageOffset] = useState(initialPageOffset);
  const [searchText, setSearchText] = useState("");

  const { response, loading, error } = useAxios(
    {
      method: "get",
      url: getSeriesList(!isNaN(pageOffset) ? pageOffset : -1, searchText),
    },
    !isNaN(pageOffset) ? pageOffset : -1,
    searchText
  );

  useEffect(() => {
    if (response !== null) {
      history.push(`/series/page/${pagination}`);
      setSeriesPayload(response?.results);
    }
  }, [response, pagination, history]);

  const handlePageClick = async ({ selected }) => {
    if (parsedId !== selected) {
      const calPagination = selected * 20;
      setPagination(selected);
      setPageOffset(calPagination);
    }
  };

  const handleClick = (c) => history.push(`/series/${c.id}`, { params: c });

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
          <Header text="MARVEL SERIES" />
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
              <div className={styles.seriesContainer}>
                {seriesPayload &&
                  seriesPayload.map((c) => (
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

export default Series;
