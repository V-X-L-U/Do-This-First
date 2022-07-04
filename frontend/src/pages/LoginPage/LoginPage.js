import { useState } from "react";
import styles from "./LoginPage.module.css";
import RegistrationModal from "../../pages/RegistrationModal/RegistrationModal";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay";
import TextField from "../../components/TextField/TextField";
import PageHeader from "../../components/PageHeader/PageHeader";
import InteractiveText from "../../components/InteractiveText/InteractiveText";
import ThemeButton from "../../components/ThemeButton/ThemeButton";
import PlainText from "../../components/PlainText/PlainText";
import ThemeColors from "../../ThemeColors";
import ModalButton from "../../components/ModalButton/ModalButton";
import PasswordField from "../../components/PasswordField/PasswordField";

const LoginPage = () => {
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  // k: the field name (i.e., "email" or "password")
  // e: event object from `input` element `onChange` callback
  const setUpdatedFormData = (k, e) => {
    const updatedFormData = { ...loginFormData };
    updatedFormData[k] = e.target.value;
    setLoginFormData(updatedFormData);
  };

  // Used to control whether the registration pop-up should be shown
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const onCancel = () => {
    setShowRegistrationModal(false);
  };

  return (
    <div>
      {showRegistrationModal ? (
        <>
          <div className={styles.preventClick} />
          <RegistrationModal hideModal={onCancel} />
        </>
      ) : (
        <></>
      )}

      <div className={styles.bg}>
        <PageHeader pageTitle="LOG IN" bgColor={ThemeColors.Red} />
        <div className={styles.credLayout}>
          <TextField fieldName="Email" color={ThemeColors.Red} />
          <PasswordField fieldName="Password" color={ThemeColors.Red} />
          <div className={styles.submitButton}>
            <ModalButton
              label="Submit"
              isEmphasized="true"
              bgColor={ThemeColors.Red}
              color={ThemeColors.White}
            />
          </div>
          <div className={styles.accountRegisterText}>
            <PlainText
              color={ThemeColors.Red}
              plainText="Don't have an account?"
            />
            <InteractiveText
              clickableText="Sign up"
              onClick={() => {
                setShowRegistrationModal(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
