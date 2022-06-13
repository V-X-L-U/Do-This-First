import { useState } from "react";
import TextField from "../TextField/TextField";
import ModalButton from "../ModalButton/ModalButton";
import ErrorDisplay from "../ErrorDisplay/ErrorDisplay";
import styles from "./RegistrationModal.module.css";
import PropTypes from "prop-types";

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

  // TODO : implement "controller" functions for respective buttons
  const onCancel = () => {
    // hint: use hide modal
  };

  const onConfirm = () => {
    // hint: use user registration handler
    // hint: set the error message appropriately, when needed
  };

  // TODO : implement modal UI
  // hint: look at the imports and use those components
  return <div></div>;
};

RegistrationModal.propTypes = {
  userRegistrationHandler: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
};

export default RegistrationModal;
