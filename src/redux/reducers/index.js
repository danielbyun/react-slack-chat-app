import { combineReducers } from "redux";
import * as actionTypes from "../types/types";

const initial_state = {
  currentUser: {},
  isLoading: true,
};

const user_reducer = (state = initial_state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_START:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.SET_USER:
      return {
        ...state,
        currentUser: action.payload.currentUser,
        isLoading: false,
      };
    case actionTypes.CLEAR_USER:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

const initial_channel_state = {
  currentChannel: {},
  isPrivateChannel: false,
  isLoading: true,
  userPosts: null,
};

const channel_reducer = (state = initial_channel_state, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel,
      };
    case actionTypes.SET_PRIVATE_CHANNEL: {
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel,
      };
    }
    case actionTypes.SET_USER_POSTS: {
      return {
        ...state,
        userPosts: action.payload.userPosts,
      };
    }
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer,
});

export default rootReducer;
