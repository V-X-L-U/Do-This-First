import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./RegistrationModal.module.css";
import PageHeader from "../../components/PageHeader/PageHeader";
import ThemeColors from "../../ThemeColors";
import ModalButton from "../../components/ModalButton/ModalButton";
import TextField from "../../components/TextField/TextField";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay";
import { validateEmailandPassword } from "../LoginPage/LoginPageLogic";
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

  const onConfirm = async () => {
    // hint: use user registration handler
    // hint: set the error message appropriately, when needed
    const validFormat = validateEmailandPassword(registrationFormData);
    if (validFormat.length > 0) {
      setErrorMessage(validFormat);
      return;
    }
    const validRegister = await userRegistrationHandler(registrationFormData);
    if (validRegister.length > 0) {
      setErrorMessage(validRegister);
    }
  };

  return (
    <div className={styles.bg}>
      <PageHeader pageTitle="SIGN UP" bgColor="transparent" />

      <div className={styles.credLayout}>
        <TextField
          fieldName="Email"
          color={ThemeColors.White}
          hidden={false}
          onChange={(e) => {
            setUpdatedFormData("email", e);
            setErrorMessage("");
          }}
        />
        <TextField
          fieldName="Password"
          color={ThemeColors.White}
          hidden={true}
          onChange={(e) => {
            setUpdatedFormData("password", e);
            setErrorMessage("");
          }}
        />
        {errorMessage.length > 0 ? (
          <ErrorDisplay errorMessage={errorMessage} />
        ) : (
          <></>
        )}
      </div>

      <div
        className={styles.buttonLayout}
        style={{ marginTop: `${errorMessage.length > 0 ? 0 : 45}px` }}
      >
        <ModalButton
          onClick={hideModal}
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

RegistrationModal.propTypes = {
  userRegistrationHandler: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
};

export default RegistrationModal;
