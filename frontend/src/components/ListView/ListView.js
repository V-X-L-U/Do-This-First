import { useState } from "react";
import styles from "./ListView.module.css";
import PropTypes from "prop-types";
import TaskListItem from "../TaskListItem/TaskListItem";
import { ThemeColors, TaskColors } from "../../ThemeColors";
import PrereqListItem from "../PrereqListItem/PrereqListItem";

const ListView = ({ tasks, TaskType }) => {
  const convertInt = (x) => {
    if (x.task_done && x.prereqs_done) {
      return 0;
    } else if (!x.task_done && !x.prereqs_done) {
      return 1;
    } else {
      return 2;
    }
  };

  tasks.sort(function (a, b) {
    return convertInt(b) - convertInt(a);
  });

  const listItems = tasks.map(function (task, ix) {
    const taskColor = task.task_done
      ? TaskColors.FinishedTask
      : task.prereqs_done
      ? TaskColors.ValidTask
      : TaskColors.InvalidTask;
    return (
      <li key={ix} className={styles.TaskItemList}>
        <TaskType taskName={task.name} taskStatusColor={taskColor} />
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
