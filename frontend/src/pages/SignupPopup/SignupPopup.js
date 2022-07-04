import { useState } from "react";
import styles from "./SignupPopup.module.css";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay";
import PageHeader from "../../components/PageHeader/PageHeader";
import PlainText from "../../components/PlainText/PlainText";
import ThemeColors from "../../ThemeColors";
import ModalButton from "../../components/ModalButton/ModalButton";
import PasswordField from "../../components/PasswordField/PasswordField";
import TextField from "../../components/TextField/TextField";

const SignupPopup = () => {
  return (
    <div className={styles.bg}>
      <PageHeader pageTitle="SIGN UP" />

      <div className={styles.credLayout}>
        <TextField fieldName="Email" color={ThemeColors.White} />
        <PasswordField fieldName="Password" color={ThemeColors.White} />
      </div>
      <div className={styles.buttonLayout}>
        <ModalButton
          label="Cancel"
          isEmphasized="true"
          bgColor={ThemeColors.White}
          color={ThemeColors.Red}
        />
        <ModalButton
          // TODO: Add onClick that changes showRegistrationModal
          label="Confirm"
          isEmphasized="true"
          bgColor={ThemeColors.White}
          color={ThemeColors.Red}
        />
      </div>
    </div>
  );
};

export default SignupPopup;
