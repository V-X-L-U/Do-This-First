import styles from "./ModalButton.module.css";
import { ThemeColors } from "../../ThemeColors";
import PropTypes from "prop-types";

const ModalButton = ({ label, onClick, isEmphasized, bgColor, color }) => {
  return (
    <button
      style={{
        backgroundColor: isEmphasized ? bgColor : ThemeColors.Grey,
        color: isEmphasized ? color : "#c0c0c0",
      }}
      onClick={onClick}
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
  bgColor: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default ModalButton;
