import { createContext, useCallback, useState } from "react";
import { useCookies } from "react-cookie";

export interface User {
  clearToken: () => any;
  storeToken: (token: string, username: string) => any;
  displayName: string;
  token: string;
}

export const UserContext = createContext<User>({
  storeToken: () => {},
  displayName: "",
  token: "",
  clearToken: () => null,
});

const JWT_TOKEN_COOKIE_NAME = "token";

export const useUserProvider = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [cookies, setCookie, removeCookie] = useCookies([
    JWT_TOKEN_COOKIE_NAME,
  ]);

  const token = cookies[JWT_TOKEN_COOKIE_NAME];

  const storeToken = useCallback(
    (token: string, displayName: string) => {
      setDisplayName(displayName);
      setCookie(JWT_TOKEN_COOKIE_NAME, token, { expires: null });
    },
    [setCookie, setDisplayName]
  );

  const clearToken = () => {
    removeCookie(JWT_TOKEN_COOKIE_NAME);
  };

  return { token, storeToken, displayName, clearToken };
};
