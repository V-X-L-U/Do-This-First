import { instance } from "../../instance";
import { ThemeColors } from "../../ThemeColors";
import AddTaskButton from "../../components/AddTaskButton/AddTaskButton";
import PageHeader from "../../components/PageHeader/PageHeader";
import ListView from "../../components/ListView/ListView";
import TaskListItem from "../../components/TaskListItem/TaskListItem";
import styles from "./TaskListPage.module.css";
import TaskListView from "../../components/TaskListView/TaskListView";

const TaskListPage = () => {
  const onDelete = () => {};

  const onEdit = () => {};

  const t = [
    {
      _id: "62ae9c508a6a011402317e82",
      user_id: "629bca3c45785085a2b31af0",
      name: "task 1",
      description: "Buy meat at TnT",
      prereqs_done: true,
      task_done: false,
      prereqs: [],
      createdAt: "2022-06-19T03:47:28.751Z",
      updatedAt: "2022-06-19T03:47:28.751Z",
      __v: 0,
    },
    {
      _id: "62ae9cdd8a6a011402317e87",
      user_id: "629bca3c45785085a2b31af0",
      name: "Groceries 2",
      description: "Buy meat at Walmart",
      prereqs_done: true,
      task_done: true,
      prereqs: [],
      createdAt: "2022-06-19T03:49:49.594Z",
      updatedAt: "2022-06-19T03:49:49.594Z",
      __v: 0,
    },
    {
      _id: "62ae9cdd8a6a011402317e87",
      user_id: "629bca3c45785085a2b31af0",
      name: "Groceries 3",
      description: "Buy meat at Walmart",
      prereqs_done: false,
      task_done: false,
      prereqs: [],
      createdAt: "2022-06-19T03:49:49.594Z",
      updatedAt: "2022-06-19T03:49:49.594Z",
      __v: 0,
    },
    {
      _id: "62ae9cdd8a6a011402317e87",
      user_id: "629bca3c45785085a2b31af0",
      name: "Groceries 2",
      description: "Buy meat at Walmart",
      prereqs_done: true,
      task_done: true,
      prereqs: [],
      createdAt: "2022-06-19T03:49:49.594Z",
      updatedAt: "2022-06-19T03:49:49.594Z",
      __v: 0,
    },
    {
      _id: "62ae9cdd8a6a011402317e87",
      user_id: "629bca3c45785085a2b31af0",
      name: "Groceries 3",
      description: "Buy meat at Walmart",
      prereqs_done: false,
      task_done: false,
      prereqs: [],
      createdAt: "2022-06-19T03:49:49.594Z",
      updatedAt: "2022-06-19T03:49:49.594Z",
      __v: 0,
    },
  ];

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
        trailingComp={<AddTaskButton onAdd={() => {}} />}
      />
      <div className={styles.listViewModal}>
        <TaskListView tasks={t} onDelete={onDelete()} onEdit={onEdit()} />
      </div>
    </div>
  );
};

export default TaskListPage;
