import PropTypes from "prop-types";
import styles from "./PrereqListItem.module.css";
import { TaskColors } from "../../ThemeColors";

const PrereqListItem = ({ taskName, taskStatusColor }) => {
  return (
    <div className={styles.prereqListItem}>
      <div
        className={styles.taskName}
        style={{
          color: taskStatusColor,
          textDecoration:
            taskStatusColor === TaskColors.Finished ? "line-through" : "none",
        }}
      >
        {taskName}
      </div>
    </div>
  );
};

PrereqListItem.propTypes = {
  taskName: PropTypes.string.isRequired,
  taskStatusColor: PropTypes.string.isRequired,
};

export default PrereqListItem;
