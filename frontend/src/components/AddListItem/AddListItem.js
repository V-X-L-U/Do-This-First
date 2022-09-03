import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./AddListItem.module.css";
import { TaskColors } from "../../ThemeColors";

const AddListItem = ({
  taskData,
  taskStatusColor,
  isChecked,
  prereqTasks,
  userTasks,
  onPrereqsChange,
}) => {
  const findTaskById = taskId => userTasks.find(task => task._id === taskId);

  const onClick = event => {
    const prereqTasks_ = [...prereqTasks];

    const clickedTask = findTaskById(event.target.value);
    if (event.target.checked) {
      prereqTasks_.push(clickedTask);
    } else {
      prereqTasks_.splice(prereqTasks_.indexOf(clickedTask), 1);
    }

    onPrereqsChange(prereqTasks_);
  };

  return (
    <div className={styles.addListItem}>
      <input
        value={taskData._id}
        type="checkbox"
        defaultChecked={isChecked}
        onClick={onClick}
      />
      <div
        style={{
          color: taskStatusColor,
          textDecoration:
            taskStatusColor === TaskColors.Finished ? "line-through" : "none",
        }}
      >
        {taskData.name}
      </div>
    </div>
  );
};

AddListItem.propTypes = {
  taskData: PropTypes.object.isRequired,
  taskStatusColor: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  prereqTasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  userTasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onPrereqsChange: PropTypes.func.isRequired,
};

export default AddListItem;
