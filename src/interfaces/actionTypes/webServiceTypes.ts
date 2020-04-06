export const ACTIONS = {
    GET_ALL: "web-service/get_all",
    GET_STATUS_ACCOUNT: "web-service/get_status_account",
    GET_UNPAID_INVOICES: "web-service/get_unpaid_invoices",
    GET_REPORTED_PAYMENTS: "web-service/get_reported_payments",
    GET_BALANCE: "web-service/get_balance",
    GET: "web-service/get",
    GET_LIST: "web-service/get_list",
    SET_LOADING: "web-service/set_loading",
    SET_STATUS_ACCOUNT_LOADING: "web-service/set__status_account_loading",
    SET_UNPAID_INVOICES_LOADING: "web-service/set__unpaid_invoices_loading",
    SET_REPORTED_PAYMENTS_LOADING: "web-service/set__reported_payments_loading",
    SET_BALANCE_LOADING: "web-service/set__balance_loading",
    SET_PAGINATION: "web-service/set_pagination",
    CLEAR_LIST: "web-service/clear_list"
  };
  
  interface Get {
    type: typeof ACTIONS.GET;
    payload: Array<string | number>;
  }

  interface GetBalance {
    type: typeof ACTIONS.GET_BALANCE;
    payload: Array<string | number>;
  }
  
  interface GetAll {
    type: typeof ACTIONS.GET_ALL;
    payload: Array<string | number>;
  }

    interface GetUnpaidInvoices {
    type: typeof ACTIONS.GET_UNPAID_INVOICES;
    payload: Array<string | number>;
  }

      interface GeReportedPayments {
    type: typeof ACTIONS.GET_REPORTED_PAYMENTS;
    payload: Array<string | number>;
  }
  
  interface GetList {
    type: typeof ACTIONS.GET_LIST;
    payload: Array<string | number>;
  }
  
  interface ClearList {
    type: typeof ACTIONS.CLEAR_LIST;
    payload: Array<string | number>;
  }
  
  interface SetLoading {
    type: typeof ACTIONS.SET_LOADING;
    payload: boolean;
  }

    
  interface SetuUnpaidInvoicesLoading {
    type: typeof ACTIONS.SET_UNPAID_INVOICES_LOADING;
    payload: boolean;
  }

  interface SetReportedPaymentsLoading {
    type: typeof ACTIONS.SET_REPORTED_PAYMENTS_LOADING;
    payload: boolean;
  }

    
  interface SetStatusAccountLoading {
    type: typeof ACTIONS.SET_STATUS_ACCOUNT_LOADING;
    payload: boolean;
  }

  interface SetBalanceLoading {
    type: typeof ACTIONS.SET_BALANCE_LOADING;
    payload: boolean;
  }
  
  interface SetPagination {
    type: typeof ACTIONS.SET_PAGINATION;
    payload: Array<string | number>;
  }
  
  export type ActionTypes =
    | Get
    | GetAll
    | SetLoading
    | SetPagination
    | GetList
    | SetStatusAccountLoading
    | GetUnpaidInvoices
    | GeReportedPayments
    | SetuUnpaidInvoicesLoading
    | SetReportedPaymentsLoading
    | ClearList
    | SetBalanceLoading
    | GetBalance;
  