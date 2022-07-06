import styles from "./TextField.module.css";
import PropTypes from "prop-types";
import PlainText from "../PlainText/PlainText";
import ThemeColors from "../../ThemeColors";

// Standard text field.
// param: void onChanged(<fieldType>)
const TextField = ({ fieldName, onChange, color, hidden }) => {
  return (
    <div className={styles.textField}>
      <PlainText plainText={fieldName} color={color} />
      <input
        type={hidden ? "password" : "text"}
        className={styles.inputBox}
        onChange={onChange}
      ></input>
    </div>
  );
};

TextField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  hidden: PropTypes.bool.isRequired,
};

export default TextField;
