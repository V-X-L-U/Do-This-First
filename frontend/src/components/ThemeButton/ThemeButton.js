import styles from "./ThemeButton.module.css";
import PropTypes from "prop-types";

// A general purpose themed button
const ThemeButton = ({ label, onClick }) => {
  return (
    <button className={styles.themeButton} onClick={onClick}>
      {label}
    </button>
  );
};

ThemeButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ThemeButton;
