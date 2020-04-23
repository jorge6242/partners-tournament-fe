export const ACTIONS = {
  GET_ALL: "tournament/get_all",
  GET_INSCRIPTIONS: "tournament/get_inscriptions",
  GET: "tournament/get",
  GET_LIST: "tournament/get_list",
  GET_TOURNAMENTS_BY_CATEGORY: "tournament/get_tournaments_by_category",
  SET_LOADING: "tournament/set_loading",
  SET_REPORT_LOADING: "tournament/set_report_loading",
  GET_INSCRIPTIONS_LOADING: "tournament/get_inscriptions_loading",
  SET_PARTICIPANT_LOADING: "tournament/set_participant_loading",
  SET_PAGINATION: "tournament/set_pagination",
};

interface Get {
  type: typeof ACTIONS.GET;
  payload: Array<string | number>;
}

interface SetReportLoading {
  type: typeof ACTIONS.SET_REPORT_LOADING;
  payload: boolean;
}

interface GetInscriptions {
  type: typeof ACTIONS.GET_INSCRIPTIONS;
  payload: Array<string | number>;
}

interface GetTournamentsByCategory {
  type: typeof ACTIONS.GET_TOURNAMENTS_BY_CATEGORY;
  payload: Array<string | number>;
}

interface GetAll {
  type: typeof ACTIONS.GET_ALL;
  payload: Array<string | number>;
}

interface GetList {
  type: typeof ACTIONS.GET_LIST;
  payload: Array<string | number>;
}

interface SetLoading {
  type: typeof ACTIONS.SET_LOADING;
  payload: boolean;
}

interface SetParticipantLoading {
  type: typeof ACTIONS.SET_PARTICIPANT_LOADING;
  payload: boolean;
}

interface GetInscriptionsLoading {
  type: typeof ACTIONS.GET_INSCRIPTIONS_LOADING;
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
  | GetTournamentsByCategory
  | GetInscriptionsLoading
  | GetInscriptions
  | SetParticipantLoading
  | SetReportLoading;
