import { instance } from "../../instance";

export const logoutUserHandler = () => {
  return instance
    .post("/api/auth/logout", {})
    .then(() => "")
    .catch(err => {
      if (
        err &&
        "response" in err &&
        "data" in err.response &&
        "message" in err.response.data
      )
        return err.response.data.message;
      else console.log(err);
    });
};
