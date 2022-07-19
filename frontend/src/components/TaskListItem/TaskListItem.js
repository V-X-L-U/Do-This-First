import { useState } from "react";
import PropTypes from "prop-types";
import { BsTrash } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";
import styles from "./TaskListItem.module.css";

const TaskListItem = ({ taskName, taskStatusColor }) => {
  const editTask = () => {};

  const deleteTask = () => {};

  return (
    <div className={styles.taskListItem}>
      <div className={styles.taskName} style={{ color: taskStatusColor }}>
        {taskName}
      </div>
      <div className={styles.buttonLayout}>
        <button className={styles.editButton}>
          <FiEdit2 className={styles.editIcon}></FiEdit2>
        </button>
        <button className={styles.deleteButton}>
          <BsTrash className={styles.deleteIcon} />
        </button>
      </div>
    </div>
  );
};

TaskListItem.propTypes = {
  taskName: PropTypes.string.isRequired,
  taskStatusColor: PropTypes.string.isRequired,
};

export default TaskListItem;
