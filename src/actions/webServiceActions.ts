import API from "../api/WebService";
import snackBarUpdate from "../actions/snackBarActions";
// import { updateModal } from "../actions/modalActions";
import { ACTIONS } from '../interfaces/actionTypes/webServiceTypes';

export const getStatusAccount = () => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_STATUS_ACCOUNT_LOADING,
    payload: true
  });
  try {
    const { data , status } = await API.getStatusAccount();
    let response = [];
    if (status === 200) {
      response = data;
      dispatch({
        type: ACTIONS.GET_STATUS_ACCOUNT,
        payload: response
      });
      dispatch({
        type: ACTIONS.SET_STATUS_ACCOUNT_LOADING,
        payload: false
      });
    }
    return response;
  } catch (error) {
    snackBarUpdate({
      payload: {
        message: error.message,
        status: true,
        type: "error"
      }
    })(dispatch);
    dispatch({
      type: ACTIONS.SET_STATUS_ACCOUNT_LOADING,
      payload: false
    });
    return error;
  }
};

export const getUnpaidInvoices = () => async (dispatch: Function) => {
    dispatch({
      type: ACTIONS.SET_UNPAID_INVOICES_LOADING,
      payload: true
    });
    try {
      const { data , status } = await API.getUnpaidInvoices();
      let response = [];
      if (status === 200) {
        response = data;
        dispatch({
          type: ACTIONS.GET_UNPAID_INVOICES,
          payload: response
        });
        dispatch({
          type: ACTIONS.SET_UNPAID_INVOICES_LOADING,
          payload: false
        });
      }
      return response;
    } catch (error) {
      snackBarUpdate({
        payload: {
          message: error.message,
          status: true,
          type: "error"
        }
      })(dispatch);
      dispatch({
        type: ACTIONS.SET_UNPAID_INVOICES_LOADING,
        payload: false
      });
      return error;
    }
  };

  export const getReportedPayments = () => async (dispatch: Function) => {
    dispatch({
      type: ACTIONS.SET_REPORTED_PAYMENTS_LOADING,
      payload: true
    });
    try {
      const { data: { data } , status } = await API.getReportedPayments();
      let response = [];
      if (status === 200) {
        response = data;
        dispatch({
          type: ACTIONS.GET_REPORTED_PAYMENTS,
          payload: response
        });
        dispatch({
          type: ACTIONS.SET_REPORTED_PAYMENTS_LOADING,
          payload: false
        });
      }
      return response;
    } catch (error) {
      snackBarUpdate({
        payload: {
          message: error.message,
          status: true,
          type: "error"
        }
      })(dispatch);
      dispatch({
        type: ACTIONS.SET_REPORTED_PAYMENTS_LOADING,
        payload: false
      });
      return error;
    }
  };

    export const getBalance = () => async (dispatch: Function) => {
    dispatch({
      type: ACTIONS.SET_BALANCE_LOADING,
      payload: true
    });
    try {
      const { data: { data } , status } = await API.getBalance();
      let response = [];
      if (status === 200) {
        if(data) {
          response = data[0];
        }
        dispatch({
          type: ACTIONS.GET_BALANCE,
          payload: response
        });
        dispatch({
          type: ACTIONS.SET_BALANCE_LOADING,
          payload: false
        });
      }
      return response;
    } catch (error) {
      snackBarUpdate({
        payload: {
          message: error.message,
          status: true,
          type: "error"
        }
      })(dispatch);
      dispatch({
        type: ACTIONS.SET_BALANCE_LOADING,
        payload: false
      });
      return error;
    }
  };