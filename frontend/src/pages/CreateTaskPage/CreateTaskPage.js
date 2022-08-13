import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateTaskPage.module.css";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay";
import PageHeader from "../../components/PageHeader/PageHeader";
import { ThemeColors, TaskColors } from "../../ThemeColors";
import ListView from "../../components/ListView/ListView";
import PrereqListItem from "../../components/PrereqListItem/PrereqListItem";
import TextField from "../../components/TextField/TextField";
import PrereqField from "../../components/PrereqField/PrereqField";
import ModalButton from "../../components/ModalButton/ModalButton";
import InteractiveText from "../../components/InteractiveText/InteractiveText";
import AddPrereqListModal from "../../components/AddPrereqListModal/AddPrereqListModal";

const CreateTaskPage = () => {
  const [showPrereqList, setShowPrereqList] = useState(false);

  const hidePrereqList = () => {
    setShowPrereqList(false);
  };
  const prereq = [
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
  ];

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
  ];

  return (
    <div className={styles.bg}>
      {showPrereqList ? (
        <>
          <div>
            <div className={styles.preventClick} />
            <AddPrereqListModal
              userTasks={t}
              prereqTasks={prereq}
              onCancel={hidePrereqList}
              onConfirm={() => {}}
            />
          </div>
        </>
      ) : (
        <></>
      )}
      <PageHeader pageTitle="CREATE TASK" bgColor={ThemeColors.Red} />
      <div className={styles.bodyWrapper}>
        <div className={styles.taskCreationForm}>
          <TextField
            fieldName="Name"
            color={ThemeColors.Red}
            onChange={() => {}}
            hidden={false}
            multiline={false}
          />
          <TextField
            fieldName="Description"
            color={ThemeColors.Red}
            onChange={() => {}}
            hidden={false}
            multiline={true}
          />
          <PrereqField
            fieldName="Prerequisites"
            color={ThemeColors.Red}
            tasks={prereq}
          />
          <div className={styles.buttonLayout}>
            <InteractiveText
              clickableText="Add prerequisites"
              onClick={() => setShowPrereqList(true)}
              color={ThemeColors.Red}
            />
            <ModalButton
              onClick={() => {}}
              label="save"
              isEmphasized={true}
              bgColor={ThemeColors.Red}
              color={ThemeColors.White}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;
