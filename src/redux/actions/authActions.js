import axios from "axios";
import { API_URL } from "../../helper";

//* without thunk
export const CartAction = (input) => {
  return {
    type: "UPDATECART",
    cart: input,
  };
};

export const LoginAction = (input) => {
  return {
    type: "LOGIN",
    payload: input,
  };
};
export const ResetAction = () => {
  return {
    type: "RESET",
  };
};
export const ResetActionthunk = () => {
  return (dispatch) => {
    dispatch({ type: "RESET" });
  };
};

export const LogOutAction = () => {
  return {
    type: "LOGOUT",
  };
};

export const ErrorAction = (errmess) => {
  return {
    type: "ERROR",
    error: errmess,
  };
};
export const LoadingAction = () => {
  return {
    type: "LOADING",
  };
};
// TODO Register
//? 1. input username, password , comfirm password dimana punya besar dan kecil minimal 6 char
//? 2. sama atau nggak pass dan confirmpass, jika beda jangan dilanjutkan kasih tau user untuk ubah
//? 3. di cek di axios bahwa username sudah digunakan atau tidak
//? 4. jika sudah digunakan maka kasih tau user bahwa username telah dipakai, jika tidak lanjutkan ke step 5
//? 5. post data  ke json-server data users
//? 6. jika berhasil, redirect langsung ke home dengan cara mengupdate data Auth reducers sama seperti Login
//?. cat: jangan lupa set localstroge seperti login agar dia bisa keep login

//* with thunk
export const LoginActionThunk = (input) => {
  var { username, password } = input;
  return (dispatch) => {
    dispatch({ type: "LOADING" });
    axios
      .post(`${API_URL}/auth/login`, {
        emailorusername: username,
        password: password,
      })
      .then((res) => {
        console.log(res.data);
        console.log(res.headers);
        localStorage.setItem("TA", res.headers["x-token-access"]);
        localStorage.setItem("TR", res.headers["x-token-refresh"]);
        dispatch({ type: "LOGIN", payload: res.data });
      })
      .catch((err) => {
        // console.log(err.response.statusText);
        dispatch({ type: "ERROR", error: err.response.data.message });
      });
  };
};

export const RegActionThunk = (input) => {
  return (dispatch) => {
    var { username, password, confirmpass, email } = input;
    let data = {
      username,
      password,
      email,
    };
    if (password === confirmpass) {
      dispatch({ type: "LOADING" });
      axios
        .post(`${API_URL}/auth/register`, data)
        .then((res1) => {
          console.log(res1.data);
          console.log(res1.headers);
          localStorage.setItem("TA", res1.headers["x-token-access"]);
          localStorage.setItem("TR", res1.headers["x-token-refresh"]);
          dispatch({ type: "LOGIN", payload: res1.data });
        })
        .catch((err) => {
          dispatch({ type: "ERROR", error: err.response.data.message });
        });
    } else {
      dispatch({ type: "ERROR", error: "confirm dan pass harus sama" });
    }
  };
};