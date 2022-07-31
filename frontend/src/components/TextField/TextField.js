import styles from "./TextField.module.css";
import PropTypes from "prop-types";
import PlainText from "../PlainText/PlainText";
import TextArea from "../TextArea/TextArea";

// Standard text field.
// param: void onChanged(<fieldType>)
const TextField = ({ fieldName, onChange, color, hidden, multiline }) => {
  return (
    <div className={styles.textField}>
      <div className={styles.labelBox}>
        <PlainText plainText={fieldName} color={color} />
      </div>
      {multiline ? (
        <div className={styles.descriptionInput}>
          <TextArea onChange={onChange} />
        </div>
      ) : (
        <input
          type={hidden ? "password" : "text"}
          className={styles.inputBox}
          onChange={onChange}
        ></input>
      )}
    </div>
  );
};

TextField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  hidden: PropTypes.bool.isRequired,
  multiline: PropTypes.bool.isRequired,
};

export default TextField;
