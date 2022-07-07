import styles from "./PlainText.module.css";
import PropTypes from "prop-types";

const PlainText = ({ plainText, color }) => {
  return (
    <div className={styles.plainText} style={{ color: color }}>
      {plainText}
    </div>
  );
};

PlainText.propTypes = {
  plainText: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default PlainText;
