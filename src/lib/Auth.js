import UniversalCookie from 'universal-cookie';

function Auth(sessionValid) {
  if (!(this instanceof Auth)) {
    return new Auth(sessionValid);
  }
  this.sessionValid = sessionValid;
}

Auth.COOKIE_NAME = 'ad-auth-jwt-token';

Auth.isTokenPresent = function isTokenPresent() {
  if (this.getToken()) {
    return true;
  }
  return false;
};

Auth.isTokenValid = async function isTokenValid(token) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const request = new Request('/api/auth/jwt/verify', {
    method: 'POST',
    headers,
    body: JSON.stringify({ token }),
  });
  try {
    const response = await fetch(request);
    if (response.status === 401) {
      return false;
    }
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

Auth.hasAccess = async function hasAccess() {
  if (this.isTokenPresent()) {
    const token = this.getToken();
    const isTokenValid = await this.isTokenValid(token);
    return isTokenValid;
  }
  return false;
};

Auth.login = async function login() {
  const hasAccess = await this.hasAccess();
  if (!hasAccess) {
    window.location = '/api/auth/login?clientId=cc6a88e7-dfd9-4248-ad7d-92da47fc6727&clientSecret=V9PezpvSAkULy3KA2HFC8Po6SX9od9zyAolvj4z3t24=&adAppName=cmod-dev&redirectSuccessUrl=/&redirectFailureUrl=/unauthorized';
    return new Auth(false); // this will never be executed
  }
  return new Auth(true);
};

Auth.getToken = function getToken() {
  const cookie = new UniversalCookie(document.cookie);
  return cookie.get(this.COOKIE_NAME);
};

Auth.removeToken = function removeToken() {
  const cookie = new UniversalCookie(document.cookie);
  return cookie.remove(this.COOKIE_NAME);
};

export default Auth;
