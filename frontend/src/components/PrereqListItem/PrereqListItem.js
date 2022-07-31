import { useState } from "react";
import PropTypes from "prop-types";
import { TiDelete } from "react-icons/ti";
import styles from "./PrereqListItem.module.css";
import { TaskColors } from "../../ThemeColors";

const PrereqListItem = ({ taskName, taskStatusColor }) => {
  const deleteTask = () => {};

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
      <div className={styles.deleteBtnLayout}>
        <button className={styles.deleteButton} onClick={deleteTask}>
          <TiDelete className={styles.deleteIcon} />
        </button>
      </div>
    </div>
  );
};

PrereqListItem.propTypes = {
  taskName: PropTypes.string.isRequired,
  taskStatusColor: PropTypes.string.isRequired,
};

export default PrereqListItem;
