import PropTypes from "prop-types";
import styles from "./TextArea.module.css";

const TextArea = ({ onChange }) => {
  return (
    <div className={styles.textAreaWrapper}>
      <textarea className={styles.textArea} onChange={onChange} />
    </div>
  );
};

TextArea.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default TextArea;
