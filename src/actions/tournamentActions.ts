import API from "../api/Tournament";
import Axios from "../config/Axios";
import Prefix from "../config/ApiPrefix";
import headers from "../helpers/headers";
import snackBarUpdate from "./snackBarActions";
import { updateModal } from "./modalActions";
import { ACTIONS } from '../interfaces/actionTypes/toournamentTypes';
import Message from '../helpers/message';

const attempts = window.attempts;

export const getAll = (page: number = 1, perPage: number = 8) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true
  });
  try {
    const { data: { data }, status } = await API.getAll(page, perPage);
    let response = [];
    if (status === 200) {
      const pagination = {
        total: data.total,
        perPage: data.per_page,
        prevPageUrl: data.prev_page_url,
        currentPage: data.current_page,
      }
      response = data.data;
      dispatch({
        type: ACTIONS.GET_ALL,
        payload: response
      });
      dispatch({
        type: ACTIONS.SET_PAGINATION,
        payload: pagination
      });
      dispatch({
        type: ACTIONS.SET_LOADING,
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
      type: ACTIONS.SET_LOADING,
      payload: false
    });
    return error;
  }
};

export const getList = (count: number = 0) => async (dispatch: Function) => {
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
    if(count <= attempts) {
      let counter = count + 1;
      dispatch(getList(counter));
    } else {
      snackBarUpdate({
        payload: {
          message: error.message,
          status: true,
          type: "error",
        },
      })(dispatch);
    }
    dispatch(updateModal({
      payload: {
        isLoader: false,
      }
    }));
    return error;
  }
};

export const getByCategory = (id: any) => async (dispatch: Function) => {
  dispatch(updateModal({
    payload: {
      isLoader: true,
    }
  }));
  try {
    const { data , status } = await API.getByCategory(id);
    let response = [];
    if (status === 200) {
      response = data;
      dispatch({
        type: ACTIONS.GET_TOURNAMENTS_BY_CATEGORY,
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

export const getAvailableTournamentsByCategory = (id: any) => async (dispatch: Function) => {
  dispatch(updateModal({
    payload: {
      isLoader: true,
    }
  }));
  try {
    const { data , status } = await API.getAvailableTournamentsByCategory(id);
    let response = [];
    if (status === 200) {
      response = data;
      dispatch({
        type: ACTIONS.GET_TOURNAMENTS_BY_CATEGORY,
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

export const getAvailableTournament = (id: any) => async (dispatch: Function) => {
  dispatch(updateModal({
    payload: {
      isLoader: true,
    }
  }));
  try {
    const { data: { data } , status } = await API.getAvailableTournament(id);
    let response = [];
    if (status === 200) {
      response = data;
      dispatch(updateModal({
        payload: {
          isLoader: false,
        }
      }));
    }
    return response;
  } catch (error) {
    const message = Message.exception(error);
    dispatch(updateModal({
      payload: {
        isLoader: false,
      }
    }));
    snackBarUpdate({
      payload: {
        message,
        status: true,
        type: "error"
      }
    })(dispatch);
    return error;
  }
};

export const search = (term: string, perPage: number = 8) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true
  });
  try {
    const { data: { data }, status } = await API.search(term, perPage);
    let response = [];
    if (status === 200) {
      response = data;
      const pagination = {
        total: data.total,
        perPage: data.per_page,
        prevPageUrl: data.prev_page_url,
        currentPage: data.current_page,
      }
      response = data.data;
      dispatch({
        type: ACTIONS.GET_ALL,
        payload: response
      });
      dispatch({
        type: ACTIONS.SET_PAGINATION,
        payload: pagination
      });
    }
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false
    });
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
      type: ACTIONS.SET_LOADING,
      payload: false
    });
    return error;
  }
};

export const create = (body: object) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true
  });
  try {
    const response = await API.create(body);
    const { status } = response;
    let createresponse: any = [];
    if (status === 200 || status === 201) {
      createresponse = response;
      snackBarUpdate({
        payload: {
          message: "Torneo Creado!",
          type: "success",
          status: true
        }
      })(dispatch);
      dispatch(getAll());
      dispatch(
        updateModal({
          payload: {
            status: false,
            element: null
          }
        })
      );
      dispatch({
        type: ACTIONS.SET_LOADING,
        payload: false
      });
    }
    return createresponse;
  } catch (error) {
    let message = 'General Error';
    if (error && error.response) {
      const { data: { message: msg } } = error.response; 
      message = msg
    }
    snackBarUpdate({
      payload: {
        message,
        type: "error",
        status: true
      }
    })(dispatch);
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false
    });
    return error;
  }
};

export const createParticipant = (body: object) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_PARTICIPANT_LOADING,
    payload: true
  });
  try {
    const response = await API.createParticipant(body);
    const { status } = response;
    let createresponse: any = [];
    if (status === 200 || status === 201) {
      createresponse = response;
      snackBarUpdate({
        payload: {
          message: "Su solicitud de inscripcion ha sido recibida exitosamente!",
          type: "success",
          status: true
        }
      })(dispatch);
      dispatch(
        updateModal({
          payload: {
            status: false,
            element: null
          }
        })
      );
      dispatch({
        type: ACTIONS.SET_PARTICIPANT_LOADING,
        payload: false
      });
    }
    return createresponse;
  } catch (error) {
    let message = 'General Error';
    if (error && error.response) {
      const { data: { message: msg } } = error.response; 
      message = msg
    }
    snackBarUpdate({
      payload: {
        message,
        type: "error",
        status: true
      }
    })(dispatch);
    dispatch({
      type: ACTIONS.SET_PARTICIPANT_LOADING,
      payload: false
    });
    throw error;
  }
};

export const get = (id: number) => async (dispatch: Function) => {
  dispatch(updateModal({
    payload: {
      isLoader: true,
    }
  }));
  try {
    const { data: { data }, status } = await API.get(id);
    let response = [];
    if (status === 200) {
      response = data;
    }
    dispatch(updateModal({
      payload: {
        isLoader: false,
      }
    }));
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
        type: "error",
        status: true
      }
    })(dispatch);
    return error;
  }
};

export const update = (body: object) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true
  });
  try {
    const { data, status } = await API.update(body);
    let response: any = [];
    if (status === 200) {
      response = {
        data,
        status
      };
      snackBarUpdate({
        payload: {
          message: "Torneo actualizado!",
          type: "success",
          status: true
        }
      })(dispatch);
      dispatch(
        updateModal({
          payload: {
            status: false,
            element: null
          }
        })
      );
      dispatch(getAll());
      dispatch({
        type: ACTIONS.SET_LOADING,
        payload: false
      });
    }
    return response;
  } catch (error) {
    let message = 'General Error';
    if (error && error.response) {
      const { data: { message: msg } } = error.response; 
      message = msg
    }
    snackBarUpdate({
      payload: {
        message,
        type: "error",
        status: true
      }
    })(dispatch);
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false
    });
    return error;
  }
};

export const remove = (id: number) => async (dispatch: Function) => {
  try {
    const { data, status } = await API.remove(id);
    let response: any = [];
    if (status === 200) {
      response = {
        data,
        status
      };
      snackBarUpdate({
        payload: {
          message: "Torneo  Eliminado!",
          type: "success",
          status: true
        }
      })(dispatch);
      dispatch(getAll());
    }
    return response;
  } catch (error) {
    const message = Message.exception(error);
    snackBarUpdate({
      payload: {
        message,
        type: "error",
        status: true
      }
    })(dispatch);
    return error;
  }
};

export const getInscriptions = (page: number = 1, perPage: number = 8, query: object = {}) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.GET_INSCRIPTIONS_LOADING,
    payload: true
  });
  try {
    const { data: { data }, status } = await API.getInscriptions(page, perPage, query);
    let response = [];
    if (status === 200) {
      const pagination = {
        total: data.total,
        perPage: data.per_page,
        prevPageUrl: data.prev_page_url,
        currentPage: data.current_page,
      }
      response = data;
      dispatch({
        type: ACTIONS.GET_INSCRIPTIONS,
        payload: response
      });
      dispatch({
        type: ACTIONS.SET_PAGINATION,
        payload: pagination
      });
      dispatch({
        type: ACTIONS.GET_INSCRIPTIONS_LOADING,
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
      type: ACTIONS.GET_INSCRIPTIONS_LOADING,
      payload: false
    });
    return error;
  }  
};

export const getInscriptionsByParticipant = (page: number = 1, perPage: number = 8, query: object = {}) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.GET_INSCRIPTIONS_LOADING,
    payload: true
  });
  try {
    const { data, status } = await API.getInscriptionsByParticipant(page, perPage, query);
    let response = [];
    if (status === 200) {
      const pagination = {
        total: data.total,
        perPage: data.per_page,
        prevPageUrl: data.prev_page_url,
        currentPage: data.current_page,
      }
      response = data.data;
      dispatch({
        type: ACTIONS.GET_INSCRIPTIONS,
        payload: response
      });
      dispatch({
        type: ACTIONS.SET_PAGINATION,
        payload: pagination
      });
      dispatch({
        type: ACTIONS.GET_INSCRIPTIONS_LOADING,
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
      type: ACTIONS.GET_INSCRIPTIONS_LOADING,
      payload: false
    });
    return error;
  }  
};

export const getInscriptionsReport = (page: number = 1, perPage: number = 8, query: object = {}) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.GET_INSCRIPTIONS_LOADING,
    payload: true
  });
  try {
    const { data: { data }, status } = await API.getInscriptionsReport(page, perPage, query);
    let response = [];
    if (status === 200) {
      const pagination = {
        total: data.total,
        perPage: data.per_page,
        prevPageUrl: data.prev_page_url,
        currentPage: data.current_page,
      }
      response = data;
      dispatch({
        type: ACTIONS.GET_INSCRIPTIONS_REPORT,
        payload: response
      });
      dispatch({
        type: ACTIONS.SET_PAGINATION,
        payload: pagination
      });
      dispatch({
        type: ACTIONS.GET_INSCRIPTIONS_LOADING,
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
      type: ACTIONS.GET_INSCRIPTIONS_LOADING,
      payload: false
    });
    return error;
  }  
};

export const getInscripcionsReportPDF = (body: object) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_REPORT_LOADING,
    payload: true
  })
  Axios({
    url: `${Prefix.api}/tournament-inscriptions-report-pdf`,
    method: "GET",
    responseType: "blob", // important
    params: { ...body },
    headers: headers()
  }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "accessControlReport.pdf");
    document.body.appendChild(link);
    link.click();
    dispatch({
      type: ACTIONS.SET_REPORT_LOADING,
      payload: false
    });
  });
};

export const getParticipant = (id: number) => async (dispatch: Function) => {
  try {
    const { data, status } = await API.getParticipant(id);
    let response = [];
    if (status === 200) {
      response = data;
    }
    return response;
  } catch (error) {
    snackBarUpdate({
      payload: {
        message: error.message,
        type: "error",
        status: true
      }
    })(dispatch);
    return error;
  }
};

export const updateParticipant = (body: object, comment = false) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_PARTICIPANT_LOADING,
    payload: true
  });
  try {
    const { data, status } = await API.updateParticipant(body);
    let response: any = [];
    if (status === 200) {
      response = {
        data,
        status
      };
      snackBarUpdate({
        payload: {
          message: comment ? "Comentario Actualizado!" : "Inscripcion Actualizada",
          type: "success",
          status: true
        }
      })(dispatch);

      dispatch(
        updateModal({
          payload: {
            status: false,
            element: null
          }
        })
      );
      dispatch(getInscriptions());
      dispatch({
        type: ACTIONS.SET_PARTICIPANT_LOADING,
        payload: false
      });
    }
    return response;
  } catch (error) {
    let message = 'General Error';
    if (error && error.response) {
      const { data: { message: msg } } = error.response; 
      message = msg
    }
    snackBarUpdate({
      payload: {
        message,
        type: "error",
        status: true
      }
    })(dispatch);
    dispatch({
      type: ACTIONS.SET_PARTICIPANT_LOADING,
      payload: false
    });
    return error;
  }
};
