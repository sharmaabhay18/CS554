import { combineReducers } from "redux";
import trainerReducer from "./reducers/trainerReducer";

const rootReducer = combineReducers({
  trainerReducer: trainerReducer,
});

export default rootReducer;
