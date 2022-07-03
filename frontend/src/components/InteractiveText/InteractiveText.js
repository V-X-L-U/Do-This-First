import styles from "./InteractiveText.module.css";
import PropTypes from "prop-types";

// Creates a text that has a plain part and a clickable part.
// param: void onClick()
const InteractiveText = ({ clickableText, onClick }) => {
  return (
    <div onClick={onClick} className={styles.interactiveText}>
      {clickableText}
    </div>
  );
};

InteractiveText.propTypes = {
  plainText: PropTypes.string.isRequired,
  clickableText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default InteractiveText;
