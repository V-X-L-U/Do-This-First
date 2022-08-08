import styles from "./PageHeader.module.css";
import PropTypes from "prop-types";

const PageHeader = ({ pageTitle, bgColor, trailingComp }) => {
  return (
    <h1
      className={styles.pageHeader}
      style={{
        backgroundColor: bgColor,
      }}
    >
      {pageTitle}
      {trailingComp === null ? <></> : trailingComp}
    </h1>
  );
};

PageHeader.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  trailingComp: PropTypes.element,
};

export default PageHeader;
