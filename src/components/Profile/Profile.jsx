import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './Profile.css';
import Auth from '../../lib/Auth';

function Profile() {
  const auth = Auth.getInstance();
  const { email, name } = auth.getUserDetails();
  const groups = auth.getGroups();
  return (
    <Paper styleName="container">
      <Typography variant="title">User Profile</Typography>
      <div styleName="row">
        <Typography styleName="field-title" variant="body1">Email: </Typography>
        <Typography variant="body1">{email}</Typography>
      </div>
      <div styleName="row">
        <Typography styleName="field-title" variant="body1">Groups: </Typography>
        <ol styleName="group-list">{Profile.renderGroups(groups)}</ol>
      </div>
      <div styleName="row">
        <Typography styleName="field-title" variant="body1">Name: </Typography>
        <Typography variant="body1">{name}</Typography>
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

export default Profile;
