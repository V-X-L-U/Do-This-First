import styles from "./PageHeader.module.css";
import PropTypes from "prop-types";

const PageHeader = ({ pageTitle }) => {
  return <h1 className={styles.PageHeader}>{pageTitle}</h1>;
};

PageHeader.propTypes = {
  pageTitle: PropTypes.string.isRequired,
};

export default PageHeader;
