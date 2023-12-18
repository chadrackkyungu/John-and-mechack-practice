import React, { useEffect, useReducer, useRef, createContext, useContext } from "react";
import PropTypes from "prop-types";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => ({
    ...state,
    ...(action.payload
      ? { isAuthenticated: true, isLoading: false, user: action.payload }
      : { isLoading: false }),
  }),
  [HANDLERS.SIGN_IN]: (state, action) => ({
    ...state,
    isAuthenticated: true,
    user: action.payload,
  }),
  [HANDLERS.SIGN_OUT]: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    try {
      const isAuthenticated = window.sessionStorage.getItem("authenticated") === "true";

      if (isAuthenticated) {
        const user = {
          id: "5e86809283e28b96d2d38537",
          name: "John Muleka to change",
          email: "mulekajohn44@gmail.com",
          role: "user",
          firstTimeUser: true,
          suspended: false,
          verifyEmail: true,
        };

        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: user,
        });
      } else {
        dispatch({
          type: HANDLERS.INITIALIZE,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const signIn = async (result) => {
    try {
      window.sessionStorage.setItem("authenticated", "true");
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: result.user._id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.roles,
      firstTimeUser: result.user.firstTimeUser,
      suspended: result.user.suspended,
      verifyEmail: result.user.verifyEmail,
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });
  };

  const signUp = async (email, name, password) => {
    throw new Error("Sign up is not implemented");
  };

  const signOut = () => {
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
