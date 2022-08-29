import styles from "./TaskListView.module.css";
import PropTypes from "prop-types";
import { TaskColors } from "../../ThemeColors";
import TaskListItem from "../TaskListItem/TaskListItem";

const TaskListView = ({ tasks, onDelete, onEdit }) => {
  const convertTaskToInt = taskToConvert => {
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
        <TaskListItem taskName={task.name} taskStatusColor={taskColor} />
      </li>
    );
  });

  return <div className={styles.listView}>{listItems}</div>;
};

TaskListView.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default TaskListView;
