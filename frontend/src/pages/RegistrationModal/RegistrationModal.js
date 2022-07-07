import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./RegistrationModal.module.css";
import PageHeader from "../../components/PageHeader/PageHeader";
import ThemeColors from "../../ThemeColors";
import ModalButton from "../../components/ModalButton/ModalButton";
import TextField from "../../components/TextField/TextField";
// User Registration pop-up.
//
// param: void hideModal()
//  hides the modal
//
// param: String userRegistrationHandler(email, password)
//  Registers a user. Returns an error message if an error occured.
//  Otherwise, returns an empty string.
const RegistrationModal = ({ hideModal, userRegistrationHandler }) => {
  const [registrationFormData, setRegistrationFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  // k: the field name (i.e., "email" or "password")
  // e: event object from `input` element `onChange` callback
  const setUpdatedFormData = (k, e) => {
    const updatedFormData = { ...registrationFormData };
    // see TextField
    updatedFormData[k] = e.target.value;
    setRegistrationFormData(updatedFormData);
  };

  const onConfirm = () => {
    // hint: use user registration handler
    // hint: set the error message appropriately, when needed
  };

  return (
    <div className={styles.bg}>
      <PageHeader pageTitle="SIGN UP" bgColor="transparent" />

      <div className={styles.credLayout}>
        <TextField
          fieldName="Email"
          color={ThemeColors.White}
          hidden={false}
          onChange={() => {}}
        />
        <TextField
          fieldName="Password"
          color={ThemeColors.White}
          hidden={true}
          onChange={() => {}}
        />
      </div>
      <div className={styles.buttonLayout}>
        <ModalButton
          onClick={hideModal}
          label="Cancel"
          isEmphasized={true}
          bgColor={ThemeColors.White}
          color={ThemeColors.Red}
        />
        <ModalButton
          onClick={() => {}}
          label="Confirm"
          isEmphasized={true}
          bgColor={ThemeColors.White}
          color={ThemeColors.Red}
        />
      </div>
    </div>
  );
};

RegistrationModal.propTypes = {
  userRegistrationHandler: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
};

export default RegistrationModal;
