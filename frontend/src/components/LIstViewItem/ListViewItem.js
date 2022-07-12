import { useState } from "react";
import styles from "./ListViewItem.module.css";

const ListViewItem = () => {
  return (
    <div className={styles.listViewItem}>
      <div className={styles.taskName}>
        {/* TODO: change color based on task status, icons, dyanamic task names */}
        Task Name
      </div>
      <div className={styles.buttonLayout}>
        <button className={styles.editButton} />
        <button className={styles.editButton} />
      </div>
    </div>
  );
};

export default ListViewItem;
