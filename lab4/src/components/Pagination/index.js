import React from "react";
import ReactPaginate from "react-paginate";
import PropTypes from "prop-types";

import styles from "./pagination.module.scss";

const Pagination = ({ handlePageClick, pageCount, forcePagination }) => {
  return (
    <div className={styles.pageContianer}>
      {pageCount && pageCount !== 0 ? (
        <ReactPaginate
          hrefBuilder={(pageIndex) => {
            console.log("pageIndex", pageIndex);
            return "/";
          }}
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={5}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          activeClassName={styles.activeSideBarStyle}
          previousLinkClassName={styles.pageLinkStyle}
          nextLinkClassName={styles.pageLinkStyle}
          containerClassName={styles.mainContainer}
          initialPage={0}
          disableInitialCallback
          forcePage={forcePagination}
          ariaLabelBuilder={(page, selected) =>
            selected ? "The current page is page " + page : "It's page " + page
          }
          pageLinkClassName={styles.pageLinkStyle}
        />
      ) : null}
    </div>
  );
};

export default Pagination;

Pagination.propTypes = {
  calPageCount: PropTypes.func,
  forcePagination: PropTypes.number,
  handlePageClick: PropTypes.func,
};
