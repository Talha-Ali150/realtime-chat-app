import { createContext, useContext, useEffect, useReducer } from "react";
import { userReducer } from "./UserReducer";

const User = createContext();

const initialUserState = () => {
  const savedUser = localStorage.getItem("user");
  return {
    user: savedUser ? JSON.parse(savedUser) : null,
  };
};

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, {}, initialUserState);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  const login = (payload) => {
    dispatch({
      type: "SET_USER",
      payload: payload,
    });
  };

  const logout = () => {
    dispatch({
      type: "LOGOUT",
    });
  };

  return (
    <User.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </User.Provider>
  );
};
export default UserProvider;

export const UserState = () => {
  return useContext(User);
};
