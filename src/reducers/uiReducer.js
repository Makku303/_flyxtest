import { ACTION_TYPES } from '../constants'

export default (
  state = {
    search: {
      focus: false,
      keyword: ''
    },
    flights: [],
    filteredFlights: []
  },
  action) => {
  switch (action.type) {
    case ACTION_TYPES.ui.focusSearch:
      let keyword = action.data;

      let filteredFlight =  state.flights.filter(item=>{
        return Object.values(item).map(function (value) {
            return String(value).toLowerCase();
        }).find(function (value) {
            return value.includes(keyword.toLowerCase());
        });
      });

      return {
        ...state,
        search: {
          focus: true,
          keyword: action.data
        },
        filteredFlights: filteredFlight
      }
    case ACTION_TYPES.ui.blurSearch:
      let searchKey = action.data;

      let filteredFlights =  state.flights.filter(item=>{
        return Object.values(item).map(function (value) {
            return String(value).toLowerCase();
        }).find(function (value) {
            return value.includes(searchKey.toLowerCase());
        });
      });

      return {
        ...state,
        search: {
          focus: false,
          keyword: action.data
        },
        filteredFlights: filteredFlights
      }
      case ACTION_TYPES.ui.loadFlights:
        return {
          ...state,
          flights: action.data,
          filteredFlights: action.data
        }
    default:
      return state
  }
}