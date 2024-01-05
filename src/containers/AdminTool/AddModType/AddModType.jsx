import React, { useEffect } from 'react';
import './AddModType.css';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const AddModType = () => {
  useEffect(() => {
  }, []);

  return (
    <>
      <Grid elevation={0} item styleName="card" xs={12}>
        <Grid container styleName="list-item">
          <Grid item xs={12}>
            <div styleName="text-label">Add Mod Type</div>
          </Grid>
        </Grid>
        <Grid container styleName="list-item">
          <Grid item xs={6}> New Case Type </Grid>
          <Grid item xs={6}>
            <TextField styleName="text-box" />
          </Grid>
        </Grid>
        <Grid container styleName="list-item">
          <Grid item xs={6}> Code </Grid>
          <Grid item xs={6}>
            <TextField styleName="text-box" />
          </Grid>
        </Grid>
        <Grid container styleName="list-item">
          <Grid item xs={6}> Workout Type </Grid>
          <Grid item xs={6}>
            <TextField styleName="text-box" />
          </Grid>
        </Grid>
        <Grid container styleName="list-item">
          <Grid item xs={6}> Friendly Name </Grid>
          <Grid item xs={6}>
            <TextField styleName="text-box" />
          </Grid>
        </Grid>
        <Grid container styleName="list-item">
          <Grid item xs={6}> Secondary Friendly Name </Grid>
          <Grid item xs={6}>
            <TextField styleName="text-box" />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

AddModType.defaultProps = {
};

AddModType.propTypes = {
};

export default AddModType;
