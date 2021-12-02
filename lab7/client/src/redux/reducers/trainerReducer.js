import Types from "../../utils/types";

// eslint-disable-next-line import/no-anonymous-default-export
export default (
  state = {
    payload: [],
  },
  action
) => {
  switch (action.type) {
    case Types.ADD_TRAINER:
      return {
        payload: action.payload,
      };
    case Types.SELECT_TRAINER:
      return {
        payload: action.payload,
      };
    case Types.DELETE_TRAINER:
      return {
        payload: action.payload,
      };
    case Types.UPDATE_TRAINER:
      return {
        payload: action.payload,
      };

    default:
      return state;
  }
};
