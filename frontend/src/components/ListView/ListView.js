import { useState } from "react";
import styles from "./ListView.module.css";
import ListViewItem from "../LIstViewItem/ListViewItem";

const ListView = () => {
  return (
    <div className={styles.listView}>
      <ListViewItem />
      <ListViewItem />
      <ListViewItem />
      <ListViewItem />
      <ListViewItem />
      <ListViewItem />
    </div>
  );
};

export default ListView;
