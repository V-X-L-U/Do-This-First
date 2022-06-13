import styles from "./ErrorDisplay.module.css";
import PropTypes from "prop-types";

const ErrorDisplay = ({ errorMessage }) => {
  return <div className={styles.errorDisplay}>{errorMessage}</div>;
};

ErrorDisplay.propTypes = {
  errorMessage: PropTypes.string.isRequired,
};

export default ErrorDisplay;
