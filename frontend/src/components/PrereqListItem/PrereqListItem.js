import { useState } from "react";
import PropTypes from "prop-types";
import { TiDelete } from "react-icons/ti";
import styles from "./PrereqListItem.module.css";

const PrereqListItem = ({ task, status }) => {
  const deleteTask = () => {};

  return (
    <div className={styles.prereqListItem}>
      <div className={styles.taskName} color={status}>
        {task}
      </div>
      <div className={styles.deleteBtnLayout}>
        <button className={styles.deleteButton}>
          <TiDelete className={styles.deleteIcon} />
        </button>
      </div>
    </div>
  );
};

PrereqListItem.propTypes = {
  task: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

export default PrereqListItem;
