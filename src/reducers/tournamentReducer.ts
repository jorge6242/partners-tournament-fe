import {
  ACTIONS,
  ActionTypes,
} from "../interfaces/actionTypes/toournamentTypes";

type InitState = {
  list: Array<string | number>;
  tournamentsByCategory: Array<string | number>;
  inscriptions: Array< string | number>
  inscriptionsReport: Array< string | number>
  loading: boolean;
  setParticipantLoading: boolean;
  getInscriptionsLoading: boolean;
  pagination: any;
  listData: any;
};

const initialState: InitState = {
  list: [],
  tournamentsByCategory: [],
  loading: false,
  pagination: {
    total: 0,
    perPage: 0,
    prevPageUrl: null,
    currentPage: 0,
  },
  listData: [],
  setParticipantLoading: false,
  inscriptions: [],
  getInscriptionsLoading: false,
  inscriptionsReport: [],
};

const tournamentReducer = (state = initialState, action: ActionTypes) => {
  switch (action.type) {
    case ACTIONS.GET_ALL:
      return {
        ...state,
        list: action.payload,
      };
          case ACTIONS.GET_INSCRIPTIONS:
      return {
        ...state,
        inscriptions: action.payload,
      };
      case ACTIONS.GET_INSCRIPTIONS_REPORT:
        return {
          ...state,
          inscriptionsReport: action.payload,
        };
    case ACTIONS.GET_TOURNAMENTS_BY_CATEGORY:
      return {
        ...state,
        tournamentsByCategory: action.payload,
      };
    case ACTIONS.GET_LIST:
      return {
        ...state,
        listData: action.payload,
      };
    case ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
      case ACTIONS.SET_PARTICIPANT_LOADING:
        return {
          ...state,
          setParticipantLoading: action.payload,
        };
        case ACTIONS.GET_INSCRIPTIONS_LOADING:
            return {
              ...state,
              getInscriptionsLoading: action.payload,
            };
    default:
      return state;
  }
};

export default tournamentReducer;
