/* eslint-disable */
//AD GROUPS DEFINED BELOW MUST BE IN LOWER CASE
function mock() {
  const {
    default: UniversalCookie
  } = require('universal-cookie');
  const cookie = new UniversalCookie(document.cookie);
  cookie.set('app-session-jwt-token', 'xx.eyJkYXRhIjp7InVzZXIiOnsiaWQiOiJkYTgyNmFhYy0zMzg5LTQ3NjctYmM0Ny02YTRkNTFkYzBjM2YiLCJkaXNwbGF5TmFtZSI6IlJhamluaWthbnRoIFNoYW5tdWdhbSIsImdpdmVuTmFtZSI6IlJhamluaWthbnRoIiwiam9iVGl0bGUiOiJQcmluY2lwYWwgU3lzdGVtcyBEZXZlbG9wZXIiLCJtYWlsIjoiUmFqaW5pa2FudGguU2hhbm11Z2FtMkBtcmNvb3Blci5jb20iLCJ1c2VyUHJpbmNpcGFsTmFtZSI6IlJhamluaWthbnRoLlNoYW5tdWdhbTJAbXJjb29wZXIuY29tIiwic3VybmFtZSI6IlNoYW5tdWdhbSIsIm9uUHJlbWlzZXNTYW1BY2NvdW50TmFtZSI6InJzaGFubXVnYTIifX0sImlhdCI6MTU1OTEwNzE5OSwiZXhwIjoxNTU5MTEwNzk5fQ==.xx');
  cookie.set('powerbi-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkhCeGw5bUFlNmd4YXZDa2NvT1UyVEhzRE5hMCIsImtpZCI6IkhCeGw5bUFlNmd4YXZDa2NvT1UyVEhzRE5hMCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzY1M2FmNDgtOGQyNC00YzQzLWJiYWEtYjg1NDcxMzljMGY1LyIsImlhdCI6MTU1OTE1OTI2NiwibmJmIjoxNTU5MTU5MjY2LCJleHAiOjE1NTkxNjMxNjYsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84TEFBQUFzblRkRk15L2t4NDFZRTAvSTlEd1Bvd0lsdlh4QVhoM3F0OHVIaDF4UWorTGZRd1NZa3hnSXlhUncwd3hHL080IiwiYW1yIjpbIndpYSJdLCJhcHBpZCI6ImFkZjc2MDc4LTllOGItNDA3Ni04NzU4LTg3ZWNjYTYzZWUyOSIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiU2hhbm11Z2FtIiwiZ2l2ZW5fbmFtZSI6IlJhamluaWthbnRoIiwiaW5fY29ycCI6InRydWUiLCJpcGFkZHIiOiIxOTguNzIuNzguMSIsIm5hbWUiOiJSYWppbmlrYW50aCBTaGFubXVnYW0iLCJvaWQiOiJkYTgyNmFhYy0zMzg5LTQ3NjctYmM0Ny02YTRkNTFkYzBjM2YiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtNjAyMTYyMzU4LTU3OTg5ODQxLTY4MjAwMzMzMC0xMjU4MDUiLCJwdWlkIjoiMTAwMzNGRkY5NUYyRUY0OCIsInNjcCI6IkRhc2hib2FyZC5SZWFkLkFsbCBEYXRhc2V0LlJlYWQuQWxsIEdyb3VwLlJlYWQuQWxsIFJlcG9ydC5SZWFkLkFsbCIsInN1YiI6Im5odXdpSkFjYktTVXQyekxTM3BhS0lHNjF6eHZualNNdjNuZmlmQkJLZm8iLCJ0aWQiOiI3NjUzYWY0OC04ZDI0LTRjNDMtYmJhYS1iODU0NzEzOWMwZjUiLCJ1bmlxdWVfbmFtZSI6IlJhamluaWthbnRoLlNoYW5tdWdhbTJAbXJjb29wZXIuY29tIiwidXBuIjoiUmFqaW5pa2FudGguU2hhbm11Z2FtMkBtcmNvb3Blci5jb20iLCJ1dGkiOiI4aTJSVjJGMUxVcWtUMGk0ODEtd0FBIiwidmVyIjoiMS4wIn0.DU3ASO_bJDCKM9x0juAPW2v78Etcxz1Zwb9D4aPCgr6DfosrBwno50HhmqCNAN04H9s4dffmbZSmNQNixnkhL_ki3r6CVp7rSLdGY3XNd5qB4LpcG7jccf5kU2oOnmdcKu1ifk9JO94FZ2KO9Xf6iE9p-y9bIu_t_XojTn9ioWg55gLISoGzuk1Vxo8GyEnIQeBePRJgMe0j2ctSu42oIm6_FPeQ0e8W6tEQLe--auv45YEOJ34tbrrgiRmHXWBA6wjydLxw7IUmbeZGC8zTHxdB5CPb8ZsSCT9x7PJSp6QJFalrMGHRjhsp7FZUDlGaEQDXiflsiX1UPf9lzM39OA');
  const {
    fetchMock
  } = require('fetch-mock');
  fetchMock.post(/\/api\/auth\/jwt\/verify/, 200);
  fetchMock.get(/\/api\/auth\/ad\/app\/users\/.*\/groups/, [{
    groupName: 'docgenvendor'
  }, {
    groupName: 'docgenvendor-mgr'
  },
  {
    groupName: 'fhlmcresolve'
  },{
    groupName: 'booking'
  }, {
    groupName: 'booking-mgr'
  }, {
    groupName: 'docsin'
  }, {
    groupName: 'docsin-mgr'
  }, {
    groupName: 'docgen-mgr'
  }, {
    groupName: 'stager'
  }, {
    groupName: 'util-mgr'
  }, {
    groupName: 'proc'
  }, {
    groupName: 'manager'
  }, {
    groupName: 'admin'
  }, {
    groupName: 'beuw-mgr'
  }, {
    groupName: 'feuw-mgr'
  }, {
    groupName: 'stager-mgr'
  },{
    groupName: 'rpsstager'
  },{
    groupName: 'rpsstager-mgr'
  }, {
    groupName: 'proc-mgr'
  }, {
    groupName: 'trial-mgr'
  }, {
    groupName: 'postmodstager'
  }, {
    groupName: 'trial'
  }, {
    "@odata.type": "#microsoft.graph.group",
    "id": "f8af99ef-42fd-4083-bfb4-366b48d1c4a9",
    "description": "This group will be used as QA access security group for Backend Underwriter role for CMOD application",
    "displayName": "cmod-qa-beuw",
    "securityEnabled": true,
    "groupName": "beuw"
  }, {
    "@odata.type": "#microsoft.graph.group",
    "id": "a7da537c-22f8-4195-a8bd-acf72de58c9b",
    "description": "The groups will be used as security groups for the CMOD Application",
    "displayName": "cmod-qa-feuw",
    "securityEnabled": true,
    "groupName": "feuw"
  }, {
    "@odata.type": "#microsoft.graph.group",
    "id": "f29572e5-ba5c-4287-85b1-dbe1ef4974d8",
    "description": "This AD group is used for all access to CMOD application in QA",
    "displayName": "Cmod-qa-allaccess",
    "securityEnabled": true,
    "groupName": "allaccess"
  }]);
  fetchMock.spy();
}

export default mock;