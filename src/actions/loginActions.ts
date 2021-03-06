import _ from "lodash";

import Auth from "../api/Auth";
import AXIOS from "../config/Axios";
import SecureStorage from "../config/SecureStorage";
import snackBarUpdate from "../actions/snackBarActions";
import { ACTIONS } from "../interfaces/actionTypes/loginTypes";
import { mainStatusLoading } from '../actions/loadingMainActions';
// import history from '../config/History';

const attempts = window.attempts;

export const login = (body: object) => async (dispatch: Function) => {
  dispatch({ type: ACTIONS.SET_LOADING, payload: true });
  try {
    const { data, status } = await Auth.login(body);
    let authResponse: any = [];
    if (status === 200 || status === 201) {
      authResponse = {
        data,
        status,
      };
      const { token, user } = data;
      const role = _.first(user.roles);
      const roles = user.roles;
      SecureStorage.setItem("token", token);
      dispatch({ type: ACTIONS.SET_USER, payload: { ...user, role, roles } });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
    return authResponse;
  } catch (error) {
    let title = "";
    if (error.response) {
      const {
        status,
        data: { message },
      } = error.response;
      if (status === 401) {
        title = message;
      }
    }
    snackBarUpdate({
      payload: {
        message: title,
        status: true,
        type: "error",
      },
    })(dispatch);
    dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    throw error;
  }
};

export const logout = () => (dispatch: Function) => {
  SecureStorage.removeItem("token");
  SecureStorage.clear();
  window.location.href = "/";
  dispatch({ type: ACTIONS.LOGOUT });
};

export const checkLogin = (count: number = 0) => async (dispatch: Function) => {
  dispatch(mainStatusLoading(true));
  try {
    const { data, status } = await Auth.checkLogin();
    let checkLoginResponse = [];
    if (status === 200) {
      checkLoginResponse = data;
      const { user } = data;
      const role = _.first(user.roles);
      const roles = user.roles;
      dispatch(mainStatusLoading(false));
      dispatch({ type: ACTIONS.SET_USER, payload: { ...user, role, roles } });
    }
    return checkLoginResponse;
  } catch (error) {
    if(count <= attempts) {
      let counter = count + 1;
      dispatch(checkLogin(counter));
    }
     dispatch(mainStatusLoading(false));
    return error;
  }
};

export function setupInterceptors() {
  return (dispatch: Function) => {
    AXIOS.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          dispatch(logout());
          // if(history.location.hash !== '' && history.location.hash !== '#/' && error.response.data.message === "Unauthenticated.") {
          //     window.location.href = '/';
          // }
        }
        return Promise.reject(error);
      }
    );
  };
}

export const setForcedLogin = (docId: any, token: any) => async (
  dispatch: Function
) => {
  dispatch({ type: ACTIONS.SET_LOADING, payload: true });
  dispatch(mainStatusLoading(true));
  try {
    const { data, status } = await Auth.forcedLogin(docId, token);
    let response = [];
    if (status === 200) {
      response = data;
      const { token, user } = data;
      const role = _.first(user.roles);
      const roles = user.roles;
      dispatch({ type: ACTIONS.SET_USER, payload: { ...user, role, roles } });
      SecureStorage.setItem("token", token);
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      dispatch(mainStatusLoading(false));
    }
    return response;
  } catch (error) {
    dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    dispatch(mainStatusLoading(false));
    snackBarUpdate({
      payload: {
        message: error.message,
        type: "error",
        status: true,
      },
    })(dispatch);

    return error;
  }
};
