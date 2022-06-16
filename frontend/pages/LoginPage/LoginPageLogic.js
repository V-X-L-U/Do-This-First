// Returns an empty string if email and password is valid. Otherwise, return
// appropriate error message.
const validateEmailandPassword = ({ email, password }) => {
  // TODO : validate email and password
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
  // TODO : recommended helper
  const emailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.[a-zA-Z0-9]{2,3})+$/;
  // https://www.w3resource.com/javascript/form/email-validation.php
  if (email.match(emailFormat)) {
    return "";
  }
  return "Invalid Email";
};

// Returns an empty string if password is valid. Otherwise, return appropriate
// error message.
const validatePassword = ({ password }) => {
  // TODO : recommended helper
  const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  // Minimum One Uppercase, One Lowercase, One Number and 8 Character (No special Character)
  // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
  if (password.match(passwordFormat)) {
    return "";
  }
  return "Invalid Password";
};

// Makes a call to the server to login the user.
// Returns an empty string if login is successful. Otherwise, return appropriate
// error message.
const loginUserHandler = ({ email, password }) => {
  // TODO : finish implementation
};

// Makes a call to the server to register the user.
// Returns an empty string if register is successful. Otherwise, return
// appropriate error message.
const registerUserHandler = ({ email, password }) => {
  // TODO : finish implementation
};

export { validateEmailandPassword, loginUserHandler, registerUserHandler };
