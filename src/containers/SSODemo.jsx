import React from 'react';
import Button from '@material-ui/core/Button';
import { FRONTEND_UNDERWRITER, ADMIN, BACKEND_UNDERWRITER } from '../lib/Groups';
import Auth from '../lib/Auth';

function renderAdminButton(auth) {
  if (auth.hasGroup(ADMIN)) {
    return <Button variant="contained">Admin</Button>;
  }
  return null;
}

function renderFeuwButton(auth) {
  if (auth.hasGroup(FRONTEND_UNDERWRITER)) {
    return <Button variant="contained">FEUW</Button>;
  }
  return null;
}

function renderBeuwButton(auth) {
  if (auth.hasGroup(BACKEND_UNDERWRITER)) {
    return <Button variant="contained">Beuw</Button>;
  }
  return null;
}

function SSODemo() {
  const auth = Auth.getInstance();
  const userDetails = auth.getUserDetails();
  return (
    <section>
      {userDetails.name}
      <br />
      {userDetails.email}
      <br />
      {userDetails.jobTitle}
      <br />
      {JSON.stringify(auth.getGroups())}
      <br />
      {renderAdminButton(auth)}
      <br />
      {renderFeuwButton(auth)}
      <br />
      {renderBeuwButton(auth)}
    </section>
  );
}

export default SSODemo;
