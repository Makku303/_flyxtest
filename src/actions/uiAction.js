import {ACTION_TYPES} from '../constants'
export default {
  searchFocus(keyword) {
    return dispatch => dispatch({ type: ACTION_TYPES.ui.focusSearch, data: keyword })
  },
  searchBlur(searchKey) {
    return dispatch => dispatch({ type: ACTION_TYPES.ui.blurSearch, data: searchKey })
  },
  loadFlights(keyword){
    return dispatch => dispatch({ type: ACTION_TYPES.ui.loadFlights , data: keyword})
  }
};
