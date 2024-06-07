export const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "SET_NAME":
      return { ...state, user: { ...state.user, fullName: action.payload } };
    default:
      return state;
  }
};
