import Auth from './Auth';

// tokenPayload and token are coupled. Modify them both appropriately at your own risk.
const tokenPayload = {
  data: {
    user: {
      id: 'cv6h2d28-kq38-23b2-b7h4-392bm1234ghi',
      displayName: 'Bruce Wayne',
      givenName: 'Bruce',
      jobTitle: 'The Dark Knight',
      mail: 'Bruce.Wayne@mrcooper.com',
      userPrincipalName: 'Bruce.Wayne@mrcooper.com',
      surname: 'Wayne',
      onPremisesSamAccountName: 'bwayne',
    },
  },
  iat: 1536655112,
  exp: 1536658712,
};

const token = 'jaskdfjlasdjkf.eyJkYXRhIjp7InVzZXIiOnsiaWQiOiJjdjZoMmQyOC1rcTM4LTIzYjItYjdoNC0zOTJibTEyMzRnaGkiLCJkaXNwbGF5TmFtZSI6IkJydWNlIFdheW5lIiwiZ2l2ZW5OYW1lIjoiQnJ1Y2UiLCJqb2JUaXRsZSI6IlRoZSBEYXJrIEtuaWdodCIsIm1haWwiOiJCcnVjZS5XYXluZUBtcmNvb3Blci5jb20iLCJ1c2VyUHJpbmNpcGFsTmFtZSI6IkJydWNlLldheW5lQG1yY29vcGVyLmNvbSIsInN1cm5hbWUiOiJXYXluZSIsIm9uUHJlbWlzZXNTYW1BY2NvdW50TmFtZSI6ImJ3YXluZSJ9fSwiaWF0IjoxNTM2NjU1MTEyLCJleHAiOjE1MzY2NTg3MTJ9.asdfasdjfhjekwhrk';

const getAuth = () => (
  new Auth(null, null, [
    { groupName: 'Suicide Squad' },
    { groupName: 'Expendables' },
  ])
);

describe('lib/Auth.js', () => {
  beforeEach(() => {
    document.cookie = 'ad-auth-jwt-token=' + token + '; ad-auth-refresh-token=kjflsadnkflaskdfjoiqu09idmfasdfasdkfl; authstate=asdfaskdfknsdmfaskjdflh23i4up123masdfasdf; clientId=sdfasdfklasjdflkj123k4j123kmasdfaksdfj; clientSecret=faksdflmasdfaksdlfmsvskdfj234781923ksdfjasdkf; adAppName=kasdjflkasdjflkasjdfalksdfjsldnm; redirectSuccessUrl=%2Fsuccess; redirectFailureUrl=%2Funauthorized';
  });

  test('instanceof Auth', () => {
    expect(new Auth() instanceof Auth).toBeTruthy();
    expect(Auth() instanceof Auth).toBeTruthy();
  });

  test('properties on Auth instance', () => {
    const auth1 = new Auth();
    expect(auth1.jwtPayload).toBeUndefined();
    expect(auth1.sessionValid).toBeUndefined();
    expect(auth1.groups).toBeUndefined();
    const sessionValid2 = true;
    const jwtPayload2 = {};
    const groups2 = [];
    const auth2 = new Auth(sessionValid2, jwtPayload2, groups2);
    expect(auth2.jwtPayload).toBe(jwtPayload2);
    expect(auth2.sessionValid).toBe(sessionValid2);
    expect(auth2.groups).toBe(groups2);
  });

  test('getErrorMessage :: returns correct error message', () => {
    expect(Auth.getErrorMessage({}).code).toBeNull();
    expect(Auth.getErrorMessage({}).text).toBe(Auth.failureMessages.USER_UNAUTHORIZED);
    Object.keys(Auth.failureMessages).forEach((code) => {
      expect(Auth.getErrorMessage({ search: `?error=${code}` }).code).toBe(`ERRCODE: ${code}`);
      expect(Auth.getErrorMessage({ search: `?error=${code}` }).text).toBe(Auth.failureMessages[code]);
    });
  });

  test('getToken :: returns correct JWT token', () => {
    expect(Auth.getToken()).toEqual(token);
  });

  describe('isTokenPresent', () => {
    test('returns true', () => {
      expect(Auth.isTokenPresent()).toBe(true);
    });
    test('returns false', () => {
      document.cookie = `${Auth.COOKIE_NAME}=; expires=${new Date(0).toGMTString()}`;
      expect(Auth.isTokenPresent()).toBe(false);
    });
  });

  describe('login', () => {
    beforeEach(() => {
      global.Headers = function Headers() { this.append = () => {}; };
      global.Response = function Response() { this.append = () => {}; };
      global.Request = function Request() { this.append = () => {}; };
      global.fetch = Promise.resolve({});
    });
    test('first', () => {
      Auth.login()
        .then((auth) => {
          expect(auth.sessionValid).toBeNull();
          expect(auth.jwtPayload).toBeNull();
          expect(auth.groups).toBeNull();
        });
    });
  });

  describe('hasGroup', () => {
    test('returns true', () => {
      const auth = getAuth();
      expect(auth.hasGroup('Expendables')).toBe(true);
    });
    test('returns false', () => {
      const auth = getAuth();
      expect(auth.hasGroup('Avengers')).toBe(false);
    });
  });

  describe('getGroups', () => {
    test('returns available groups', () => {
      const auth = getAuth();
      expect(auth.getGroups()).toEqual(['Suicide Squad', 'Expendables']);
    });
    test('returns empty array', () => {
      const auth = new Auth(false, null, null);
      expect(auth.getGroups()).toEqual([]);
    });
  });
  describe('getUserDetails', () => {
    test('returns empty values', () => {
      const auth = new Auth(false, null, null);
      const userDetails = auth.getUserDetails();
      expect(userDetails.email).toBe('');
      expect(userDetails.jobTitle).toBe('');
      expect(userDetails.name).toBe('');
    });

    test('returns available user data', () => {
      const userPrincipalName = 'The Undertaker';
      const jobTitle = 'Fullstack Developer';
      const displayName = 'undefined';
      const jwtPayload = {
        data: {
          user: {
            userPrincipalName,
            jobTitle,
            displayName,
          },
        },
      };
      const auth = new Auth(false, jwtPayload, null);
      const userDetails = auth.getUserDetails();
      expect(userDetails.email).toBe(userPrincipalName);
      expect(userDetails.jobTitle).toBe(jobTitle);
      expect(userDetails.name).toBe(displayName);
    });
  });

  describe('getJwtPayload', () => {
    test('returns null', () => {
      document.cookie = `${Auth.COOKIE_NAME}=; expires=${new Date(0).toGMTString()}`;
      expect(Auth.getJwtPayload()).toBeNull();
    });
    test('returns null on error', () => {
      const { atob } = global;
      global.atob = null;
      expect(Auth.getJwtPayload()).toEqual(null);
      global.atob = atob;
    });
    test('returns the payload', () => {
      expect(Auth.getJwtPayload()).toEqual(tokenPayload);
    });
  });
});
