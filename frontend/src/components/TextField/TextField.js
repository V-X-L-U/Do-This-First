import styles from "./TextField.module.css";
import PropTypes from "prop-types";
import PlainText from "../PlainText/PlainText";

// Standard text field.
// param: void onChanged(<fieldType>)
const TextField = ({ fieldName, onChange, color, hidden, multilineInput }) => {
  return (
    <div className={styles.textField}>
      <div className={styles.labelBox}>
        <PlainText plainText={fieldName} color={color} />
      </div>
      <input
        type={hidden ? "password" : "text"}
        className={styles.inputBox}
        onChange={onChange}
        style={{ height: multilineInput ? "150px" : "25px" }}
      ></input>
    </div>
  );
};

TextField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  hidden: PropTypes.bool.isRequired,
  multilineInput: PropTypes.bool.isRequired,
};

export default TextField;
