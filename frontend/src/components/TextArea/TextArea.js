import PropTypes from "prop-types";
import styles from "./TextArea.module.css";

const TextArea = ({ onChange }) => {
  return <textarea className={styles.textArea} onChange={onChange} />;
};

TextArea.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default TextArea;
