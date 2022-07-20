import PropTypes from "prop-types";
import styles from "./DeleteConfirmModal.module.css";
import PageHeader from "../PageHeader/PageHeader";
import ThemeColors from "../../ThemeColors";
import ModalButton from "../ModalButton/ModalButton";
import PlainText from "../PlainText/PlainText";

const DeleteConfirmModal = ({ onCancel, onConfirm }) => {
  return (
    <div className={styles.bg}>
      <PageHeader pageTitle="Delete task?" bgColor="transparent" />

      <div className={styles.textLayout}>
        <PlainText
          plainText="Deleted task will be permanently removed. Tasks cannot be recovered."
          color={ThemeColors.White}
        />
      </div>

      <div className={styles.buttonLayout}>
        <ModalButton
          onClick={onCancel}
          label="Cancel"
          isEmphasized={true}
          bgColor={ThemeColors.White}
          color={ThemeColors.Red}
        />
        <ModalButton
          onClick={onConfirm}
          label="Confirm"
          isEmphasized={true}
          bgColor={ThemeColors.White}
          color={ThemeColors.Red}
        />
      </div>
    </div>
  );
};

DeleteConfirmModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteConfirmModal;
