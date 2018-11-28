import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './Profile.css';
import PropTypes from 'prop-types';
import * as R from 'ramda';

function Profile({ userDetails, groups, skills }) {
  const getEmail = R.propOr('', 'email');
  const getName = R.propOr('', 'name');

  const email = getEmail(userDetails);
  const name = getName(userDetails);

  return (
    <Paper styleName="container" tabIndex={-1}>
      <Typography variant="title">User Profile</Typography>
      <div styleName="row">
        <Typography styleName="field-title" variant="body1">Name: </Typography>
        <Typography variant="body1">{name}</Typography>
      </div>
      <div styleName="row">
        <Typography styleName="field-title" variant="body1">Email: </Typography>
        <Typography variant="body1">{email}</Typography>
      </div>
      <div styleName="row">
        <Typography styleName="field-title" variant="body1">Groups: </Typography>
        <ol styleName="group-list">{Profile.renderGroups(groups)}</ol>
      </div>
      <div styleName="row">
        <Typography styleName="field-title" variant="body1">Skills: </Typography>
        <ol styleName="group-list">{Profile.renderSkills(skills)}</ol>
      </div>
    </Paper>
  );
}

Profile.renderGroups = function renderGroups(groups) {
  return groups.map(
    group => (
      <li key={group}>
        <Typography variant="body1">{group}</Typography>
      </li>
    ),
  );
};

Profile.renderSkills = function renderSkills(skills) {
  return skills && skills.map(
    skill => (
      <li key={skill}>
        <Typography variant="body1">{skill}</Typography>
      </li>
    ),
  );
};

Profile.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  skills: PropTypes.arrayOf(PropTypes.string).isRequired,
  userDetails: PropTypes.shape({
    email: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default Profile;
