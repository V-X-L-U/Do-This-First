import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./AddListItem.module.css";
import { TaskColors } from "../../ThemeColors";

const AddListItem = ({ taskName, taskStatusColor, isChecked, prereqTasks }) => {
  const onChange = event => {
    if (event.target.checked) {
      prereqTasks.push(event.target.value);
    } else {
      prereqTasks.splice(prereqTasks.indexOf(event.target.value), 1);
    }
  };
  return (
    <div className={styles.addListItem}>
      <input
        value={taskName}
        type="checkbox"
        defaultChecked={isChecked}
        onChange={onChange}
      />
      <div
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

AddListItem.propTypes = {
  taskName: PropTypes.string.isRequired,
  taskStatusColor: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  prereqTasks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AddListItem;
