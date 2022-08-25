import { useState } from "react";
import styles from "./PrereqListView.module.css";
import PropTypes from "prop-types";
import { ThemeColors, TaskColors } from "../../ThemeColors";
import AddListItem from "../AddListItem/AddListItem";

const PrereqListView = ({ userTasks, prereqTasks }) => {
  const convertTaskToInt = taskToConvert => {
    if (taskToConvert.task_done && taskToConvert.prereqs_done) {
      return 0;
    } else if (!taskToConvert.task_done && !taskToConvert.prereqs_done) {
      return 1;
    } else {
      return 2;
    }
  };

  userTasks.sort(function (task1, task2) {
    return convertTaskToInt(task2) - convertTaskToInt(task1);
  });

  const prereqStrings = [];

  for (const i in prereqTasks) {
    prereqStrings.push(prereqTasks[i]._id);
  }

  const listItems = userTasks.map(function (task, ix) {
    const taskColor = task.task_done
      ? TaskColors.Finished
      : task.prereqs_done
      ? TaskColors.Valid
      : TaskColors.Invalid;

    const containsPrereq = () => {
      return prereqStrings.includes(task._id);
    };

    return (
      <li key={ix} className={styles.listItem}>
        <AddListItem
          taskName={task.name}
          taskStatusColor={taskColor}
          isChecked={containsPrereq()}
          prereqTasks={prereqTasks}
        />
      </li>
    );
  });

  return <div className={styles.prereqListView}>{listItems}</div>;
};

PrereqListView.propTypes = {
  userTasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  prereqTasks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PrereqListView;
