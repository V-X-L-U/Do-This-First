import styles from "./TextField.module.css";
import PropTypes from "prop-types";
import PlainText from "../PlainText/PlainText";
import ThemeColors from "../../ThemeColors";

// Standard text field.
// param: void onChanged(<fieldType>)
const TextField = ({ fieldName, onChange }) => {
  return (
    <p className={styles.TextField}>
      <PlainText color={ThemeColors.Red} plainText={fieldName} />
      <input className={styles.input} onChange={onChange}></input>
    </p>
  );
};

TextField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TextField;
