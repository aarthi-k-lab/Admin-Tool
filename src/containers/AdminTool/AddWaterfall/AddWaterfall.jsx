import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core/index';
import './AddWaterfall.css';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import brandCodes from '../../../constants/admin_portal/brand';

const AddWaterfall = ({ addWaterfall }) => {
  const [waterFallName, setWaterFallName] = useState('');
  useEffect(() => {
  }, []);

  const handleSave = () => {
    addWaterfall(waterFallName);
    window.alert(`${waterFallName} added succesfully`);
  };

  const renderSelect = getDropDownOptions => (
    <Select styleName="drop-down">
      {getDropDownOptions.map(item => (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      ))}
    </Select>
  );

  return (
    <>
      <Grid elevation={0} item styleName="card" xs={3}>
        <Grid container styleName="list-item">
          <Grid item xs={9}>
            <div styleName="text-label">Add New Waterfall</div>
          </Grid>
          <Grid item xs={3}>
            <Button onClick={() => handleSave()} styleName="btn">
              SAVE
            </Button>
          </Grid>
        </Grid>

        <Grid container styleName="list-item">
          <Grid item xs={6}> Waterfall Name </Grid>
          <Grid item xs={6}>
            <TextField onChange={(e) => { setWaterFallName(e.target.value); }} />
          </Grid>
        </Grid>
        <Grid container styleName="list-item">
          <Grid item xs={6}> Waterfall Code </Grid>
          <Grid item xs={6}>
            <TextField />
          </Grid>
        </Grid>
        <Grid container styleName="list-item">
          <Grid item xs={6}> Loan Types </Grid>
          <Grid item xs={6}>
            <TextField />
          </Grid>
        </Grid>
        <Grid container styleName="list-item">
          <Grid item xs={6}> Investor Group Codes </Grid>
          <Grid item xs={6}>
            <TextField />
          </Grid>
        </Grid>
        <Grid container styleName="list-item">
          <Grid item xs={6}> Brand Codes </Grid>
          <Grid item xs={6}>
            { renderSelect(brandCodes) }
          </Grid>
        </Grid>
        <Grid container styleName="list-item">
          <Grid item xs={6}> Documents Required </Grid>
          <Grid item xs={6}>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue=""
              name="radio-buttons-group"
            >
              <Box display="flex">
                <FormControlLabel control={<Radio />} label="Yes" value="Yes" />
                <FormControlLabel control={<Radio />} label="No" value="No" />
              </Box>
            </RadioGroup>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

AddWaterfall.defaultProps = {
};

AddWaterfall.propTypes = {
  addWaterfall: PropTypes.func.isRequired,
};

export default AddWaterfall;
