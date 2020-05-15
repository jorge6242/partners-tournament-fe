import {  ACTIONS, ActionTypes } from '../interfaces/actionTypes/tPaymentMethodTypes';


// se le da tipado a los estados
type InitState = {
    list: Array<string | number>;
    loading: boolean;
    pagination: any;
    listData: any;
}

//  se inicializan los valores del estado
const initialState: InitState = {
    list: [],
    loading: false,
    pagination: {
        total: 0,
        perPage: 0,
        prevPageUrl: null,
        currentPage: 0,
    },
    listData: [],
};

//cada case hace un cambio a estado

const tPaymentMethodReducer = (state = initialState, action: ActionTypes) => {
    switch (action.type) {
        case ACTIONS.GET_ALL:
            return {
                ...state,
                list: action.payload,
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
        default:
            return state;
    }
};

export default tPaymentMethodReducer;