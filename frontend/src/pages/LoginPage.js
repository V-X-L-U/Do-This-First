import { useState } from "react";
import RegistrationModal from "../components/RegistrationModal/RegistrationModal";
import ErrorDisplay from "../components/ErrorDisplay/ErrorDisplay";
import TextField from "../components/TextField/TextField";
import PageHeader from "../components/PageHeader/PageHeader";
import InteractiveText from "../components/InteractiveText/InteractiveText";
import ThemeButton from "../components/ThemeButton/ThemeButton";

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

  // TODO : implement page UI
  // hint: look at the imports and use those components
  return <div></div>;
};
