import { instance } from "../../instance";
import { ThemeColors } from "../../ThemeColors";
import AddTaskButton from "../../components/AddTaskButton/AddTaskButton";
import PageHeader from "../../components/PageHeader/PageHeader";
import styles from "./TaskListPage.module.css";

const TaskListPage = () => {
  const createTask = async () => {
    const taskData = {
      name: "test task 1",
      description: "some desc",
      prereqs: [],
    };

    await instance
      .post("/api/tasks/create", taskData)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className={styles.bg}>
      <PageHeader
        showNav={true}
        pageTitle="TODO"
        bgColor={ThemeColors.Red}
        trailingComp={<AddTaskButton />}
      />
    </div>
  );
};

export default TaskListPage;
