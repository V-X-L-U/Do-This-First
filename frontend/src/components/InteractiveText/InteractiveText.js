import styles from "./InteractiveText.module.css";
import PropTypes from "prop-types";
import ThemeColors from "../../ThemeColors";

// Creates a text that has a plain part and a clickable part.
// param: void onClick()
const InteractiveText = ({ clickableText, onClick, color }) => {
  return (
    <button
      onClick={onClick}
      className={styles.interactiveText}
      style={{ color: color }}
    >
      {clickableText}
    </button>
  );
};

InteractiveText.propTypes = {
  clickableText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
};

export default InteractiveText;
