import * as actionTypes from "../types/types";

export const setUserStart = () => {
  return {
    type: actionTypes.SET_USER_START,
  };
};

export const setUser = (user) => {
  setUserStart();
  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: user,
    },
  };
};

export const clearUser = () => {
  return {
    type: actionTypes.CLEAR_USER,
  };
};

export const setCurrentChannel = (channel) => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL,
    payload: {
      currentChannel: channel,
    },
  };
};