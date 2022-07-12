import { useState } from "react";
import { BsTrash } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";
import styles from "./ListViewItem.module.css";

const ListViewItem = () => {
  const editTask = () => {};

  const deleteTask = () => {};

  return (
    <div className={styles.listViewItem}>
      <div className={styles.taskName}>
        {/* TODO: change color based on task status, icons, dyanamic task names */}
        Task Name
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

export default ListViewItem;
