import UniversalCookie from 'universal-cookie';

const JWT_TOKEN_COOKIE_NAME = 'app-session-jwt-token';

const fetchCookie = function fetchCookie(cookieName) {
  const cookie = new UniversalCookie(document.cookie);
  return cookie.get(cookieName);
};

export {
  fetchCookie,
  JWT_TOKEN_COOKIE_NAME,
};
