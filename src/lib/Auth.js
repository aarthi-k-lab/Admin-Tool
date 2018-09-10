import UniversalCookie from 'universal-cookie';

function Auth(sessionValid, jwtPayload, groups) {
  if (!(this instanceof Auth)) {
    return new Auth(sessionValid);
  }
  this.sessionValid = sessionValid;
  this.jwtPayload = jwtPayload;
  this.groups = groups;
}

Auth.prototype.getGroups = function getGroups() {
  if (this.groups === null) {
    return [];
  }
  return this.groups.map(group => group.displayName);
};

Auth.prototype.getUserDetails = function getUserDetails() {
  if (this.jwtPayload === null) {
    return {
      email: '',
      jobTitle: '',
      name: '',
    };
  }
  return {
    email: this.jwtPayload.data.user.userPrincipalName,
    jobTitle: this.jwtPayload.data.user.jobTitle,
    name: this.jwtPayload.data.user.displayName,
  };
};

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
    window.location = '/api/auth/login?redirectSuccessUrl=/&redirectFailureUrl=/unauthorized';
    return new Auth(false, null); // this will never be executed
  }
  const jwtPayload = this.getJwtPayload();
  const userDetails = Auth.prototype.getUserDetails.call({ jwtPayload });
  const userEmail = userDetails.email;
  const userGroup = await this.getUserGroups(userEmail);
  if (userGroup === null) {
    window.location = '/unauthorized';
    return new Auth(false, null, null);
  }
  return new Auth(true, jwtPayload, userGroup);
};

Auth.getUserGroups = async function getGroupsForUser(email) {
  const request = new Request(`/api/auth/ad/app/users/${email}/groups`, {
    method: 'GET',
  });
  try {
    const response = await fetch(request);
    if (response.status === 401) {
      return null;
    }
    if (response.status === 200) {
      return await response.json();
    }
    return null;
  } catch (err) {
    return null;
  }
};

Auth.getJwtPayload = function getJwtPayload() {
  const NULL = null;
  if (this.isTokenPresent()) {
    const token = this.getToken();
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error(e);
      return NULL;
    }
  }
  return NULL;
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
