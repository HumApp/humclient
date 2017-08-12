import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

// import action

// const initialState = {};

export default combineReducers({
  form: formReducer,
});
