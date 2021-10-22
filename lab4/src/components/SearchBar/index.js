import React from "react";
import PropTypes from "prop-types";
import classname from "classnames";

import style from "./search.module.scss";

const Search = ({ onChange, searchText }) => {
  return (
    <div className={style.searchContainer}>
      <form>
        <input
          id="searchBar"
          type="text"
          placeholder="Type here to search..."
          required
          className={classname(style.question, style.textStyle)}
          value={searchText}
          onChange={onChange}
          autoComplete="off"
        />
        <label className={style.textStyle} htmlFor="searchBar">
          <span className={style.textStyle}>Search</span>
        </label>
        <input value="Search" type="submit" className={style.submitBtn} />
      </form>
    </div>
  );
};

export default Search;

Search.propTypes = {
  searchText: PropTypes.string,
  onChange: PropTypes.func,
};
