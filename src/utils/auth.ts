import Cookies from "js-cookie";

const TokenKey = "ares-token";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token, {
    expires: 30,
  });
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
