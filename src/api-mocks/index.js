/* eslint-disable */
function mock() {
  const { default: UniversalCookie } = require('universal-cookie');
  const cookie = new UniversalCookie(document.cookie);
  cookie.set('app-session-jwt-token', 'xx.eyJkYXRhIjp7InVzZXIiOnsiaWQiOiJkZDRlOWE5Mi1kZjU3LTQyYTgtYjdhNi05MDJiZTU2MDBlZmUiLCJkaXNwbGF5TmFtZSI6IkRlZXBhbiBLdW1hcmVzYW4iLCJnaXZlbk5hbWUiOiJEZWVwYW4iLCJqb2JUaXRsZSI6IkxlYWQgRW5naW5lZXIiLCJtYWlsIjoiRGVlcGFuLkt1bWFyZXNhbkBtcmNvb3Blci5jb20iLCJ1c2VyUHJpbmNpcGFsTmFtZSI6IkRlZXBhbi5LdW1hcmVzYW5AbXJjb29wZXIuY29tIiwic3VybmFtZSI6Ikt1bWFyZXNhbiIsIm9uUHJlbWlzZXNTYW1BY2NvdW50TmFtZSI6ImRrdW1hcmVzYW4ifX0sImlhdCI6MTU0NDY5NTgyOSwiZXhwIjoxNTQ0Njk5NDI5fQ==.xx');
  cookie.set('powerbi-access-token', 'eA==.eA==.eA==');
  const { fetchMock } = require('fetch-mock');
  fetchMock.post(/\/api\/auth\/jwt\/verify/, 200);
  fetchMock.get(/\/api\/auth\/ad\/app\/users\/.*\/groups/, [{"@odata.type":"#microsoft.graph.group","id":"f8af99ef-42fd-4083-bfb4-366b48d1c4a9","description":"This group will be used as QA access security group for Backend Underwriter role for CMOD application","displayName":"cmod-qa-beuw","securityEnabled":true,"groupName":"beuw"},{"@odata.type":"#microsoft.graph.group","id":"a7da537c-22f8-4195-a8bd-acf72de58c9b","description":"The groups will be used as security groups for the CMOD Application","displayName":"cmod-qa-feuw","securityEnabled":true,"groupName":"feuw"},{"@odata.type":"#microsoft.graph.group","id":"f29572e5-ba5c-4287-85b1-dbe1ef4974d8","description":"This AD group is used for all access to CMOD application in QA","displayName":"Cmod-qa-allaccess","securityEnabled":true,"groupName":"allaccess"}]);
  fetchMock.spy();
}

export default mock;