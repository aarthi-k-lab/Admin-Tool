import * as qs from 'qs';
import UniversalCookie from 'universal-cookie';
import * as R from 'ramda';
import {
  BACKEND_UNDERWRITER, FRONTEND_UNDERWRITER, FRONTEND_MANAGER, DOC_PROCESSOR,
  FRONTEND_UNDERWRITER_BETA,
  LOAN_ACTIVITY,
} from './Groups';
import Redirect from './Redirect';

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
Auth.POWERBI_TOKEN_COOKIE_NAME = 'powerbi-access-token';

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

Auth.unauthorized = (auth) => {
  window.location = '/unauthorized';
  return auth;
};

Auth.authorized = (auth, user, jwtPayload) => {
  const sessionAuth = auth;
  sessionAuth.sessionValid = true;
  sessionAuth.jwtPayload = jwtPayload;
  sessionAuth.user = user;
  return sessionAuth;
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
    Redirect.toLogin(successRedirectUrl);
    return auth; // this will never be executed
  }

  const jwtPayload = this.getJwtPayload();
  const userDetails = Auth.prototype.getUserDetails.call({ jwtPayload });
  const { email } = userDetails;
  const userGroups = await this.getUserGroups(email);
  const skills = await this.getUserSkills(email);
  auth.groups = userGroups;
  const groupList = auth.getGroups();

  const user = {
    userDetails,
    userGroups,
    groupList,
    skills,
  };
  if (userGroups === null) {
    return this.unauthorized(auth);
  }

  return this.authorized(auth, user, jwtPayload);
};

Auth.getPowerBIAccessToken = function getPowerBIAccessToken(successRedirectUrl = '/reports') {
  const accessToken = this.fetchCookie(this.POWERBI_TOKEN_COOKIE_NAME);
  if (accessToken) {
    return accessToken;
  }
  Redirect.toReport(successRedirectUrl);
  return false;
};

Auth.getUserGroups = async function getGroupsForUser(email) {
  const request = new Request(`/api/auth/ad/app/users/${email}/groups`, {
    method: 'GET',
  });
  try {
    const response = await fetch(request);
    if (response.status === 401) {
      return [];
    }
    if (response.status === 200) {
      return await response.json();
    }
    return [];
  } catch (err) {
    return [];
  }
};

Auth.getUserSkills = async (email) => {
  const request = new Request(`/api/userskills/users/${email}/skills`, {
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
  AD_AUTH_SERVICE_FAILURE: GENERAL_ERROR_MESSAGE,
  AD_REDIRECT_FAILED: GENERAL_ERROR_MESSAGE,
  AD_TOKEN_GENERATION_FAILED: GENERAL_ERROR_MESSAGE,
  BACKEND_UNDERWRITER_ACCESS_NEEDED: 'BEUW Group Access is needed to view the Backend Underwriter Dashboard.',
  DOC_PROCESSOR_ACCESS_NEEDED: 'PROC Group Access is needed to view the Doc Processor Dashboard.',
  LOAN_ACTIVITY_ACCESS_NEEDED: 'LA Group Access is needed to view the Loan Activity Dashboard.',
  FRONTEND_UNDERWRITER_ACCESS_NEEDED: 'FEUW Group Access is needed to view the Frontend Underwriter Dashboard.',
  MANAGER_ACCESS_NEEDED: 'Manager Group Access is needed to view the Manager Dashboard.',
  MOVE_FORWARD_ACCESS_NEEDED: 'Move Forward Group Access is needed to view the Move Forward Dashboard.',
  STAGER_DASHBOARD_ACCESS_NEEDED: 'Stager Dashboard Access is needed to view the Stager Dashboard',
  USER_OBJECT_GRAPHAPI_FETCH_FAILED: GENERAL_ERROR_MESSAGE,
  USER_UNAUTHORIZED: 'You have not been assigned to the app. Kindly contact the support team.',
};

Auth.homePage = [
  {
    groupName: FRONTEND_MANAGER,
    path: '/reports',
  },
  {
    groupName: FRONTEND_UNDERWRITER_BETA,
    path: '/frontend-checklist',
  },
  {
    groupName: FRONTEND_UNDERWRITER,
    path: '/frontend-evaluation',
  },
  {
    groupName: BACKEND_UNDERWRITER,
    path: '/backend-evaluation',
  },
  {
    groupName: DOC_PROCESSOR,
    path: '/doc-processor',
  },
  {
    groupName: LOAN_ACTIVITY,
    path: '/loan-activity',
  },
];

export default Auth;
