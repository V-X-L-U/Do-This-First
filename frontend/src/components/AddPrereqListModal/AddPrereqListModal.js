import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./AddPrereqListModal.module.css";
import ListView from "../ListView/ListView";
import PrereqListItem from "../PrereqListItem/PrereqListItem";
import PageHeader from "../PageHeader/PageHeader";
import ModalButton from "../ModalButton/ModalButton";
import { ThemeColors } from "../../ThemeColors";
import PrereqListView from "../PrereqListView/PrereqListView";

const AddPrereqListModal = ({
  userTasks,
  prereqTasks,
  onClose,
  onPrereqsChange,
}) => {
  return (
    <div className={styles.bg}>
      <PageHeader
        pageTitle="Select all task to be added"
        bgColor={"transparent"}
      />

      <div className={styles.listViewBg}>
        <PrereqListView
          userTasks={userTasks}
          prereqTasks={prereqTasks}
          onPrereqsChange={onPrereqsChange}
        />
      </div>

      <div className={styles.buttonLayout}>
        <ModalButton
          onClick={onClose}
          label="Close"
          isEmphasized={true}
          bgColor={ThemeColors.White}
          color={ThemeColors.Red}
        />
      </div>
    </div>
  );
};

AddPrereqListModal.propTypes = {
  userTasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  prereqTasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
  onPrereqsChange: PropTypes.func.isRequired,
};

export default AddPrereqListModal;
