import styles from "./PageHeader.module.css";
import PropTypes from "prop-types";

const PageHeader = ({ pageTitle, bgColor }) => {
  return (
    <h1
      className={styles.pageHeader}
      style={{
        backgroundColor: bgColor,
      }}
    >
      {pageTitle}
    </h1>
  );
};

PageHeader.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
};

export default PageHeader;
