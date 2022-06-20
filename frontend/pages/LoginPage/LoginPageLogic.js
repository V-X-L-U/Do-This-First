// Returns an empty string if email and password is valid. Otherwise, return

import axios from "axios";

// appropriate error message.
const validateEmailandPassword = ({ email, password }) => {
  const validEmail = validateEmail(email);
  const validPassword = validatePassword(password);
  if (validEmail.length > 0) {
    return validEmail;
  }
  if (validPassword.length > 0) {
    return validPassword;
  }
  return "";
};

// Returns an empty string if email is valid. Otherwise, return appropriate
// error message.
const validateEmail = ({ email }) => {
  const emailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.[a-zA-Z0-9]{2,3})+$/;
  // https://www.w3resource.com/javascript/form/email-validation.php
  if (email.match(emailFormat)) {
    return "";
  }
  return "Invalid Email: Should be in the correct format (e.g. abc@tex.com)";
};

// Returns an empty string if password is valid. Otherwise, return appropriate
// error message.
const validatePassword = ({ password }) => {
  const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  // Minimum One Uppercase, One Lowercase, One Number and 8 Character (No special Character)
  // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
  if (password.match(passwordFormat)) {
    return "";
  }
  return "Invalid Password: Should contain at least 8 characters; At least 1 UpperCase, 1 LowerCase, 1 Number";
};

// Makes a call to the server to login the user.
// Returns an empty string if login is successful. Otherwise, return appropriate
// error message.
const loginUserHandler = ({ userEmail, userPassword }) => {
  // https://stackoverflow.com/questions/6396101/pure-javascript-send-post-data-without-a-form
  const data = {
    email: userEmail,
    password: userPassword,
  };
  try {
    const res = axios.post("/api/auth/login", data);
    return "";
  } catch (error) {
    if (error.res.status >= 400) {
      return error.res.data;
    }
    return "";
  }
};

// Makes a call to the server to register the user.
// Returns an empty string if register is successful. Otherwise, return
// appropriate error message.
const registerUserHandler = ({ userEmail, userPassword }) => {
  // TODO : finish implementation
  // https://stackoverflow.com/questions/6396101/pure-javascript-send-post-data-without-a-form
  const data = {
    email: userEmail,
    password: userPassword,
  };
  try {
    const res = axios.post("/api/auth/register", data);
    return "";
  } catch (error) {
    if (error.res.status >= 400) {
      return error.res.data;
    }
    return "";
  }
};

export { validateEmailandPassword, loginUserHandler, registerUserHandler };
