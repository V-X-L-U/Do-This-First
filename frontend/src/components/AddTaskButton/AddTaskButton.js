import styles from "./AddTaskButton.module.css";
import PropTypes from "prop-types";
import { MdAdd } from "react-icons/md";

const AddTaskButton = ({ onAdd }) => {
  return (
    <button onClick={onAdd} className={styles.addButton}>
      <MdAdd className={styles.addIcon} />
    </button>
  );
};

AddTaskButton.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default AddTaskButton;
