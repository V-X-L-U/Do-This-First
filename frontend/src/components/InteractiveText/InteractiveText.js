import styles from "./InteractiveText.module.css";
import PropTypes from "prop-types";

// Creates a text that has a plain part and a clickable part.
// param: void onClick()
const InteractiveText = ({ plainText, clickableText, onClick }) => {
  // TODO : complete text UI
  return <div></div>;
};

InteractiveText.propTypes = {
  plainText: PropTypes.string.isRequired,
  clickableText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default InteractiveText;
