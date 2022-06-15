// Returns an empty string if email and password is valid. Otherwise, return
// appropriate error message.
const validateEmailandPassword = ({ email, password }) => {
  // TODO : validate email and password
  if (validateEmail(email).localeCompare("") !== 0) {
    return validateEmail(email);
  } else if (validatePassword(password).localeCompare("") !== 0) {
    return validatePassword(password);
  } else {
    return "";
  }
};

// Returns an empty string if email is valid. Otherwise, return appropriate
// error message.
const validateEmail = ({ email }) => {
  // TODO : recommended helper
  const emailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.[a-zA-Z0-9]{2,3})+$/;
  if (email.match(emailFormat)) {
    return "";
  } else {
    return "Error : Invalid Email Format";
  }
};

// Returns an empty string if password is valid. Otherwise, return appropriate
// error message.
const validatePassword = ({ password }) => {
  // TODO : recommended helper
  const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  // Minimum One Uppercase, One Lowercase, One Number and 8 Character (No special Character)
  if (password.match(passwordFormat)) {
    return "";
  } else {
    return "Error : Invalid Password Format";
  }
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
