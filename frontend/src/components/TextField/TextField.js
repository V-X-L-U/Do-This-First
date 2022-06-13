import styles from "./TextField.module.css";
import PropTypes from "prop-types";

// Standard text field.
// param: void onChanged(<fieldType>)
const TextField = ({ fieldName, onChange }) => {
  // TODO : implement
  // hint: you likely need a flex box to put the field label and input box in
  // one line (input shouldn't be the base html element)
  return <input onChange={onChange}></input>;
};

TextField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TextField;
