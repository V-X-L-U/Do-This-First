import styles from "./PrereqField.module.css";
import PropTypes from "prop-types";
import PlainText from "../PlainText/PlainText";
import ListView from "../ListView/ListView";
import PrereqListItem from "../PrereqListItem/PrereqListItem";

// Standard text field.
// param: void onChanged(<fieldType>)
const PrereqField = ({ fieldName, color, tasks }) => {
  return (
    <div className={styles.PrereqField}>
      <div className={styles.labelBox}>
        <PlainText plainText={fieldName} color={color} />
      </div>
      <div className={styles.tasksList}>
        <ListView tasks={tasks} TaskType={PrereqListItem} />
      </div>
    </div>
  );
};

PrereqField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PrereqField;
