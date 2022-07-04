import styles from "./ModalButton.module.css";
import PropTypes from "prop-types";

const ModalButton = ({ label, onClick, isEmphasized, color }) => {
  return (
    <button
      color={color}
      className={isEmphasized ? styles.emphasizedButton : styles.greyedButton}
    >
      {label}
    </button>
  );
};

ModalButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isEmphasized: PropTypes.bool.isRequired,
  color: PropTypes.bool.isRequired,
};

export default ModalButton;
