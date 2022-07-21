import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import RegistrationModal from "../../pages/RegistrationModal/RegistrationModal";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay";
import TextField from "../../components/TextField/TextField";
import PageHeader from "../../components/PageHeader/PageHeader";
import InteractiveText from "../../components/InteractiveText/InteractiveText";
import PlainText from "../../components/PlainText/PlainText";
import ThemeColors from "../../ThemeColors";
import ModalButton from "../../components/ModalButton/ModalButton";
import { loginUserHandler, validateEmailandPassword } from "./LoginPageLogic";

const LoginPage = () => {
  const navigate = useNavigate();
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

  const hideModal = () => {
    setShowRegistrationModal(false);
  };

  const onSubmit = async () => {
    const validFormat = validateEmailandPassword(loginFormData);
    if (validFormat.length > 0) {
      // ERROR WRONG FORMAT
      setErrorMessage(validFormat);
      return;
    }
    const validData = await loginUserHandler(loginFormData);
    if (validData.length > 0) {
      // ERROR LOGIN FAILED
      setErrorMessage(validData);
      return;
    }
    navigate("/tasks");
  };

  return (
    <div>
      {showRegistrationModal ? (
        <>
          <div className={styles.preventClick} />
          <RegistrationModal hideModal={hideModal} />
        </>
      ) : (
        <></>
      )}

      <div className={styles.bg}>
        <PageHeader pageTitle="LOG IN" bgColor={ThemeColors.Red} />
        <div className={styles.credLayout}>
          <TextField
            fieldName="Email"
            color={ThemeColors.Red}
            hidden={false}
            onChange={(e) => {
              setUpdatedFormData("email", e);
              setErrorMessage("");
            }}
          />
          <TextField
            fieldName="Password"
            color={ThemeColors.Red}
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
          <div
            className={styles.accountRegisterText}
            style={{ marginTop: `${errorMessage.length > 0 ? 0 : 45}px` }}
          >
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
          <div className={styles.submitButton}>
            <ModalButton
              label="Submit"
              isEmphasized={true}
              bgColor={ThemeColors.Red}
              color={ThemeColors.White}
              onClick={onSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
