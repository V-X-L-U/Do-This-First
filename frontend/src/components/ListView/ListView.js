import { useState } from "react";
import styles from "./ListView.module.css";
import PropTypes from "prop-types";
import TaskListItem from "../TaskListItem/TaskListItem";
import { ThemeColors, TaskColors } from "../../ThemeColors";
import PrereqListItem from "../PrereqListItem/PrereqListItem";

const ListView = ({ tasks, TaskType: ListItemType }) => {
  const convertTaskToInt = (taskToConvert) => {
    if (taskToConvert.task_done && taskToConvert.prereqs_done) {
      return 0;
    } else if (!taskToConvert.task_done && !taskToConvert.prereqs_done) {
      return 1;
    } else {
      return 2;
    }
  };

  tasks.sort(function (task1, task2) {
    return convertTaskToInt(task2) - convertTaskToInt(task1);
  });

  const listItems = tasks.map(function (task, ix) {
    const taskColor = task.task_done
      ? TaskColors.Finished
      : task.prereqs_done
      ? TaskColors.Valid
      : TaskColors.Invalid;

    return (
      <li key={ix} className={styles.ListItem}>
        <ListItemType taskName={task.name} taskStatusColor={taskColor} />
      </li>
    );
  });

  return <div className={styles.listView}>{listItems}</div>;
};

ListView.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  TaskType: PropTypes.elementType.isRequired,
};

export default ListView;
