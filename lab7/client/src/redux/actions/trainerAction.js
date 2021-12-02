import Types from "../../utils/types";

export const addTrainerAction = (trainer) => (dispatch) => {
  dispatch({
    type: Types.ADD_TRAINER,
    payload: trainer,
  });
};

export const selectTrainerAction = (trainer) => (dispatch) => {
  dispatch({
    type: Types.SELECT_TRAINER,
    payload: trainer,
  });
};

export const deleteTrainerAction = (trainer) => (dispatch) => {
  dispatch({
    type: Types.DELETE_TRAINER,
    payload: trainer,
  });
};


export const updateTrainerAction = (trainer) => (dispatch) => {
  dispatch({
    type: Types.UPDATE_TRAINER,
    payload: trainer,
  });
};
