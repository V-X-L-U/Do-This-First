import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./AddListItem.module.css";
import { TaskColors } from "../../ThemeColors";

const AddListItem = ({ taskName, taskStatusColor, check, prereqTask }) => {
  const onChange = (event) => {
    if (event.target.checked) {
      prereqTask.push(event.target.value);
    } else {
      prereqTask.splice(prereqTask.indexOf(event.target.value), 1);
    }
  };
  return (
    <div className={styles.addListItem}>
      <input
        value={taskName}
        type="checkbox"
        defaultChecked={check}
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
  check: PropTypes.bool.isRequired,
  prereqTask: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AddListItem;
