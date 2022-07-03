import styles from "./PasswordField.module.css";
import PropTypes from "prop-types";
import PlainText from "../PlainText/PlainText";
import ThemeColors from "../../ThemeColors";

// Standard password field.
// param: void onChanged(<fieldType>)
const PasswordField = ({ fieldName, onChange }) => {
  return (
    <p className={styles.passwordField}>
      <PlainText color={ThemeColors.Red} plainText={fieldName} />
      <input
        type="password"
        className={styles.inputBox}
        onChange={onChange}
      ></input>
    </p>
  );
};

PasswordField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PasswordField;
