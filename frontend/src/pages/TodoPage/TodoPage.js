import styles from "./TodoPage.module.css";
import PageHeader from "../../components/PageHeader/PageHeader";
import ThemeColors from "../../ThemeColors";
import AddTaskButton from "../../components/AddTaskButton/AddTaskButton";

const TodoPage = () => {
  return (
    <div className={styles.bg}>
      <PageHeader
        pageTitle="TODO"
        bgColor={ThemeColors.Red}
        trailingComp={<AddTaskButton />}
      />
    </div>
  );
};

export default TodoPage;
