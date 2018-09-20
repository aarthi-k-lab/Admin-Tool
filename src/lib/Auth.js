import * as qs from 'qs';
import UniversalCookie from 'universal-cookie';
import * as R from 'ramda';
import { MANAGER } from './Groups';

function Auth(sessionValid, jwtPayload, groups) {
  if (!(this instanceof Auth)) {
    return new Auth(sessionValid);
  }
  this.sessionValid = sessionValid;
  this.jwtPayload = jwtPayload;
  this.groups = groups;
}

Auth.prototype.hasGroup = function hasGroup(groupName) {
  const foundGroup = this.groups.find(group => group.groupName === groupName);
  if (foundGroup) {
    return true;
  }
  return false;
};

Auth.prototype.getGroups = function getGroups() {
  if (this.groups === null) {
    return [];
  }
  return this.groups.map(group => group.groupName);
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

Auth.JWT_TOKEN_COOKIE_NAME = 'app-session-jwt-token';
Auth.AD_TOKEN_COOKIE_NAME = 'ad-access-token';
Auth.AD_REFRESH_TOKEN_COOKIE_NAME = 'ad-refresh-token';

Auth.singletonInstance = null;

Auth.getInstance = function getInstance() {
  if (!this.singletonInstance) {
    this.singletonInstance = new Auth(false, null, null);
  }
  return this.singletonInstance;
};

Auth.isTokenPresent = function isTokenPresent() {
  if (this.fetchCookie(this.JWT_TOKEN_COOKIE_NAME)) {
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
    const token = this.fetchCookie(this.JWT_TOKEN_COOKIE_NAME);
    const isTokenValid = await this.isTokenValid(token);
    return isTokenValid;
  }
  return false;
};

Auth.getGroupHomePage = function getGroupHomePage(groups) {
  const groups1 = R.map(R.prop(['groupName']), groups);
  if (groups.length === 0 || groups1.length === 0) {
    return '/unauthorized';
  }
  const redirectUrl = R.compose(
    R.ifElse(
      R.isNil,
      R.always('/'),
      R.prop('path'),
    ),
    R.head,
    R.filter(homeGroup => R.contains(homeGroup.groupName, groups1)),
  )(this.homePage);
  return redirectUrl;
};

Auth.login = async function login(successRedirectUrl = '/') {
  const hasAccess = await this.hasAccess();
  const auth = this.getInstance();
  auth.sessionValid = false;
  auth.jwtPayload = null;
  auth.groups = null;
  if (!hasAccess) {
    window.location = `/api/auth/login?redirectSuccessUrl=${successRedirectUrl}&redirectFailureUrl=/unauthorized`;
    return auth; // this will never be executed
  }
  if (!this.fetchCookie(this.AD_TOKEN_COOKIE_NAME) && this.isTokenPresent()) {
    await this.refreshADTokenCookie(successRedirectUrl);
  }
  const jwtPayload = this.getJwtPayload();
  const userDetails = Auth.prototype.getUserDetails.call({ jwtPayload });
  const userEmail = userDetails.email;
  const userGroups = await this.getUserGroups(userEmail);
  if (userGroups === null) {
    window.location = '/unauthorized';
    return auth;
  }
  auth.sessionValid = true;
  auth.jwtPayload = jwtPayload;
  auth.groups = userGroups;
  return auth;
};


// Refreshes AD Token Cookie (NOT App JWT Cookie) using it's refresh token
Auth.refreshADTokenCookie = async function refreshADTokenCookie(successRedirectUrl) {
  const refreshToken = this.fetchCookie(this.AD_REFRESH_TOKEN_COOKIE_NAME);
  if (refreshToken) {
    const request = new Request('/api/auth/refreshtoken/ad', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    try {
      const response = await fetch(request);
      if (response.status === 200) {
        const newAccessToken = await response.json();
        const cookie = new UniversalCookie(document.cookie);
        cookie.set(this.AD_TOKEN_COOKIE_NAME, R.get(newAccessToken, 'access_token'), { maxAge: 3550 * 1000 });
        cookie.set(this.AD_REFRESH_TOKEN_COOKIE_NAME, R.get(newAccessToken, 'refresh_token'));
        return true;
      }
    } catch (err) {
      console.error(err);
    }
  }
  window.location = `/api/auth/login?redirectSuccessUrl=${successRedirectUrl}&redirectFailureUrl=/unauthorized`;
  return false;
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
    const token = this.fetchCookie(this.JWT_TOKEN_COOKIE_NAME);
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error(e);
      return NULL;
    }
  }
  return NULL;
};

Auth.fetchCookie = function fetchCookie(cookieName) {
  const cookie = new UniversalCookie(document.cookie);
  return cookie.get(cookieName);
};

Auth.getErrorMessage = function getErrorMessage(location) {
  const params = qs.parse(location.search, { ignoreQueryPrefix: true });
  if (params.error) {
    const failureMessage = this.failureMessages[params.error];
    if (failureMessage) {
      return {
        text: failureMessage,
        code: `ERRCODE: ${params.error}`,
      };
    }
  }
  return {
    text: this.failureMessages.USER_UNAUTHORIZED,
    code: null,
  };
};

const GENERAL_ERROR_MESSAGE = 'Authentication service failed, kindly contact the support team.';

Auth.failureMessages = {
  AD_REDIRECT_FAILED: GENERAL_ERROR_MESSAGE,
  USER_UNAUTHORIZED: 'You have not been assigned to the app. Kindly contact the support team.',
  AD_TOKEN_GENERATION_FAILED: GENERAL_ERROR_MESSAGE,
  USER_OBJECT_GRAPHAPI_FETCH_FAILED: GENERAL_ERROR_MESSAGE,
  AD_AUTH_SERVICE_FAILURE: GENERAL_ERROR_MESSAGE,
};

Auth.homePage = [{
  groupName: MANAGER,
  path: '/reports',
}];

export default Auth;