import API from "../api/BancoEmisor";
import snackBarUpdate from "../actions/snackBarActions";
import { updateModal } from "../actions/modalActions";
import { ACTIONS } from '../interfaces/actionTypes/bancoEmisorTypes';

export const getList = () => async (dispatch: Function) => {
  dispatch(updateModal({
    payload: {
      isLoader: true,
    }
  }));
  try {
    const { data: { data }, status } = await API.getList();
    let response = [];
    if (status === 200) {
      response = data;
      dispatch({
        type: ACTIONS.GET_LIST,
        payload: response
      });
      dispatch(updateModal({
        payload: {
          isLoader: false,
        }
      }));
    }
    return response;
  } catch (error) {
    dispatch(updateModal({
      payload: {
        isLoader: false,
      }
    }));
    snackBarUpdate({
      payload: {
        message: error.message,
        status: true,
        type: "error"
      }
    })(dispatch);
    return error;
  }
};
