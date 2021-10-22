import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchShows from "./SearchShows";
import noImage from "../img/download.jpeg";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";

import "../App.css";
const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    border: "1px solid #1e8678",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
  },
  titleHead: {
    borderBottom: "1px solid #1e8678",
    fontWeight: "bold",
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
  },
  media: {
    height: "100%",
    width: "100%",
  },
  button: {
    color: "#1e8678",
    fontWeight: "bold",
    fontSize: 12,
  },
  iconContainer: {
    margin: "20px 40px",
    display: "flex",
    flexDirection: "row",
  },
  iconStyle: {
    cursor: "pointer",
    marginRight: "20px",
  },
});
const ShowList = (props) => {
  const {
    history,
    match: {
      params: { id },
    },
  } = props;
  const parsedId = parseInt(id);

  const regex = /(<([^>]+)>)/gi;
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [showsData, setShowsData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState(parsedId);
  const [prevPage, setPrevPage] = useState(false);
  const [nextPage, setNextPage] = useState(false);
  const [notFound, setNotFound] = useState(false);
  let card = null;

  useEffect(() => {
    console.log("on load useeffect");
    if (pagination === 0) {
      setLoading(true);
      async function fetchData() {
        try {
          const { data } = await axios.get("http://api.tvmaze.com/shows");
          setShowsData(data);
          setPrevPage(false);
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
    }
  }, [pagination]);

  useEffect(() => {
    console.log("search useEffect fired");
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await axios.get(
          "http://api.tvmaze.com/search/shows?q=" + searchTerm
        );
        setSearchData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      console.log("searchTerm is set");
      fetchData();
    }
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    history.push(`/shows/page/${pagination}`);
    if (pagination !== 0) setPrevPage(true);
    async function fetchPaginationData() {
      try {
        const { data } = await axios.get(
          "http://api.tvmaze.com/shows?page=" + pagination
        );
        setShowsData(data);
        try {
          const nextPageValue = pagination + 1;
          await axios.get("http://api.tvmaze.com/shows?page=" + nextPageValue);
          setLoading(false);
          setNextPage(true);
        } catch (e) {
          setNextPage(false);
          setLoading(false);
          console.log(e);
        }
      } catch (e) {
        console.log(e);
        setNotFound(true);
        setLoading(false);
      }
    }
    fetchPaginationData();
  }, [pagination, history]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  const paginationView = () => {
    return (
      <div className={classes.iconContainer}>
        {prevPage && (
          <div
            onClick={() => setPagination(pagination - 1)}
            className={classes.iconStyle}
          >
            <BsFillArrowLeftCircleFill color="#1e8678" size="40px" />
          </div>
        )}
        {nextPage && (
          <div
            className={classes.iconStyle}
            onClick={() => setPagination(pagination + 1)}
          >
            <BsFillArrowRightCircleFill color="#1e8678" size="40px" />
          </div>
        )}
      </div>
    );
  };

  const buildCard = (show) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
        <Card className={classes.card} variant="outlined">
          <CardActionArea>
            <Link to={`/shows/${show.id}`}>
              <CardMedia
                className={classes.media}
                component="img"
                image={
                  show.image && show.image.original
                    ? show.image.original
                    : noImage
                }
                title="show image"
              />

              <CardContent>
                <Typography
                  className={classes.titleHead}
                  gutterBottom
                  variant="h6"
                  component="h3"
                >
                  {show.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {show.summary
                    ? show.summary.replace(regex, "").substring(0, 139) + "..."
                    : "No Summary"}
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (searchTerm) {
    card =
      searchData &&
      searchData.map((shows) => {
        let { show } = shows;
        return buildCard(show);
      });
  } else {
    card =
      showsData &&
      showsData.map((show) => {
        return buildCard(show);
      });
  }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div>
        {notFound ? (
          <div>
            <h1>No shows available!</h1>
          </div>
        ) : (
          <React.Fragment>
            {paginationView()}
            <SearchShows searchValue={searchValue} />
            <br />
            <br />
            <Grid container className={classes.grid} spacing={5}>
              {card}
            </Grid>
          </React.Fragment>
        )}
      </div>
    );
  }
};

export default ShowList;
