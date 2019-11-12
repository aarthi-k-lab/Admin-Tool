import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { FRONTEND_UNDERWRITER, ADMIN, BACKEND_UNDERWRITER } from '../constants/Groups';

function renderAdminButton(groups) {
  if (groups && groups.includes(ADMIN)) {
    return <Button className="material-ui-button" variant="contained">Admin</Button>;
  }
  return null;
}

function renderFeuwButton(groups) {
  if (groups && groups.includes(FRONTEND_UNDERWRITER)) {
    return <Button className="material-ui-button" variant="contained">FEUW</Button>;
  }
  return null;
}

function renderBeuwButton(groups) {
  if (groups && groups.includes(BACKEND_UNDERWRITER)) {
    return <Button className="material-ui-button" variant="contained">Beuw</Button>;
  }
  return null;
}

function SSODemo({ groups, userDetails }) {
  return (
    <section>
      {`Welcome ${userDetails && userDetails.name}`}
      <br />
      {renderAdminButton(groups)}
      <br />
      {renderFeuwButton(groups)}
      <br />
      {renderBeuwButton(groups)}
    </section>
  );
}

SSODemo.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  userDetails: PropTypes.shape({
    email: PropTypes.string,
    jobTitle: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default SSODemo;
