import styles from "./TextField.module.css";
import PropTypes from "prop-types";
import PlainText from "../PlainText/PlainText";
import ThemeColors from "../../ThemeColors";

// Standard text field.
// param: void onChanged(<fieldType>)
const TextField = ({ fieldName, onChange, color }) => {
  return (
    <div className={styles.textField}>
      <PlainText plainText={fieldName} color={color} />
      <input className={styles.input} onChange={onChange}></input>
    </div>
  );
};

TextField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.func.isRequired,
};

export default TextField;
