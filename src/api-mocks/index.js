/* eslint-disable */
//AD GROUPS DEFINED BELOW MUST BE IN LOWER CASE
function mock() {
  const {
    default: UniversalCookie
  } = require('universal-cookie');
  const cookie = new UniversalCookie(document.cookie);
  cookie.set('app-session-jwt-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXIiOnsiaWQiOiI0ZDM0YTE5Ni03OGQ5LTQ5ZGYtODc1ZC04NWFhMDQwM2Q3MzUiLCJkaXNwbGF5TmFtZSI6IkFzaHdpbiBSYW1hbXVydGh5IiwiZ2l2ZW5OYW1lIjoiQXNod2luIiwiam9iVGl0bGUiOiJTZW5pb3IgU29mdHdhcmUgRW5naW5lZXIiLCJtYWlsIjoiQXNod2luLlJhbWFtdXJ0aHlAbXJjb29wZXIuY29tIiwidXNlclByaW5jaXBhbE5hbWUiOiJBc2h3aW4uUmFtYW11cnRoeUBtcmNvb3Blci5jb20iLCJzdXJuYW1lIjoiUmFtYW11cnRoeSIsIm9uUHJlbWlzZXNTYW1BY2NvdW50TmFtZSI6ImFyYW1hbXVydGgifX0sImlhdCI6MTY3NzEzNTMwNSwiZXhwIjoxNjc3MTM4OTA1fQ.PYUBcNXnwKZy7U1AVjDIAAdI47JkDjfbSYchs4WhsUw');
  cookie.set('powerbi-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzY1M2FmNDgtOGQyNC00YzQzLWJiYWEtYjg1NDcxMzljMGY1LyIsImlhdCI6MTY3NzU2MzU1NiwibmJmIjoxNjc3NTYzNTU2LCJleHAiOjE2Nzc1Njc1NjQsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84VEFBQUFaTkhqNDJuUFJCL1p1Wlg3bDhQczVKbTRPdWRmZjk2UStqLzB5YndIMlJIdEJOYkhNWmNxbWVqNzJuUE1aazF3WFA5T0VCTkkrNzhjaGY5Mk5KeC8weVY1MElGeFUyUVhGczNjZGppM0ZUVT0iLCJhbXIiOlsid2lhIiwibWZhIl0sImFwcGlkIjoiYmE3OTAxOWEtMjA0Ny00YmExLWFiZjktNzQ0NTJkMmFiNzUwIiwiYXBwaWRhY3IiOiIxIiwiZmFtaWx5X25hbWUiOiJSYW1hbXVydGh5IiwiZ2l2ZW5fbmFtZSI6IkFzaHdpbiIsImlwYWRkciI6IjE0LjE0My4xMTguMTYxIiwibmFtZSI6IkFzaHdpbiBSYW1hbXVydGh5Iiwib2lkIjoiNGQzNGExOTYtNzhkOS00OWRmLTg3NWQtODVhYTA0MDNkNzM1Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTYwMjE2MjM1OC01Nzk4OTg0MS02ODIwMDMzMzAtMTYzNTQxIiwicHVpZCI6IjEwMDMwMDAwQTFGMDI5RDQiLCJyaCI6IjAuQVRnQVNLOVRkaVNOUTB5N3FyaFVjVG5BOVFrQUFBQUFBQUFBd0FBQUFBQUFBQUE0QVBVLiIsInNjcCI6IkRhc2hib2FyZC5SZWFkLkFsbCBEYXRhc2V0LlJlYWQuQWxsIEdyb3VwLlJlYWQuQWxsIFJlcG9ydC5SZWFkLkFsbCIsInNpZ25pbl9zdGF0ZSI6WyJpbmtub3dubnR3ayJdLCJzdWIiOiJMRWk2NXdONnIzZkxHdXBqR3F6cjRtUzZMRm9QTTV3WHUycE1KYTZlOE93IiwidGlkIjoiNzY1M2FmNDgtOGQyNC00YzQzLWJiYWEtYjg1NDcxMzljMGY1IiwidW5pcXVlX25hbWUiOiJBc2h3aW4uUmFtYW11cnRoeUBtcmNvb3Blci5jb20iLCJ1cG4iOiJBc2h3aW4uUmFtYW11cnRoeUBtcmNvb3Blci5jb20iLCJ1dGkiOiJEemRHYUNQajhVNlYxZVBuQnZUWEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXX0.MvajmyeTVe8IKdJuiyvK2p-AGjDp5R8kcO7eaiV2R9FEt62QzrszJHhjATyjEIyhEWQok74mxREvdcycJCdhMghM9RiGpstc9kCOnY5DBXrvAVumR0D7hh1lA3nI-EXKR6BTYgtPnJeNBb2aLXyGPx0C3-H6rTkjNg73VYOmt-k1_ZO4nVGOcN4fDSsWoaCqg99i8eZ7Vr78Wxl62S6VYDfGObFvmOnP4HlptFuzN0pa5C1WdxlqGWlMDOGYZFB3qf5cm6G_yn3EzVblUCnbyPdPj3YKwjaB2trK5spxVKnZYc7viYSLq7fRmRqPleFoAc6LBTx6YAnfG63w8N1DSA');
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
    groupName: 'invset'
  }, {
    groupName: 'invset-mgr'
  }, {
    groupName: 'secondlook'
  }, {
    groupName: 'secondlook-mgr'
  },  {
    groupName: 'lossmitigation'
  }, {
    groupName: 'lossmitigation-mgr'
  }, {
    groupName: 'rshstager'
  }, {
    groupName: 'rshstager-mgr'
  }, {
    groupName: 'indexer'
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