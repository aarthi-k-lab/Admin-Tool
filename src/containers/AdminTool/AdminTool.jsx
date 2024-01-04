import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import './AdminTool.css';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import client from '../../constants/admin_portal/client';
import waterfall from '../../constants/admin_portal/waterfall';
import waterfallMapping from '../../constants/admin_portal/waterfallMapping';
import AddWaterfall from './AddWaterfall/AddWaterfall';
import AddCaseType from './AddCaseType/AddCaseType';

const AdminTool = () => {
  const [addWaterfallFlag, setAddWaterfallFlag] = useState(false);
  const [addWaterfallMappingFlag, setAddWaterfallMappingFlag] = useState(false);
  const [addCaseTypeFlag, setAddCaseTypeFlag] = useState(false);

  useEffect(() => {
  }, []);

  const renderSelect = getDropDownOptions => (
    <Select styleName="drop-down">
      {getDropDownOptions.map(item => (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      ))}
    </Select>
  );

  const handleWaterFallAdd = () => {
    setAddWaterfallFlag(!addWaterfallFlag);
    setAddWaterfallMappingFlag(false);
    setAddCaseTypeFlag(false);
  };

  const handleWaterFallMappingAdd = () => {
    setAddWaterfallMappingFlag(!addWaterfallMappingFlag);
    setAddWaterfallFlag(false);
    setAddCaseTypeFlag(false);
  };

  const handleCaseTypeAdd = () => {
    setAddCaseTypeFlag(!addCaseTypeFlag);
    setAddWaterfallFlag(false);
    setAddWaterfallMappingFlag(false);
  };

  return (
    <>
      <div styleName="card-container">
        <Grid elevation={0} item styleName="card" xs={3}>
          <div styleName="text-label">Admin Tool</div>
          <Grid container styleName="list-item">
            <Grid item xs={6}> Client </Grid>
            <Grid item xs={6}>
              { renderSelect(client) }
            </Grid>
          </Grid>
          <Grid container styleName="list-item">
            <Grid item xs={3}> Waterfall </Grid>
            <Grid item xs={3}>
              <Button onClick={() => handleWaterFallAdd()}>
                <img alt="add_btn" src="/static/img/addplus.svg" />
              </Button>
            </Grid>
            <Grid item xs={6}>
              { renderSelect(waterfall) }
            </Grid>
          </Grid>
          <Grid container styleName="list-item">
            <Grid item xs={3}> Waterfall Mapping </Grid>
            <Grid item xs={3}>
              <Button onClick={() => handleWaterFallMappingAdd()}>
                <img alt="add_btn" src="/static/img/addplus.svg" />
              </Button>
            </Grid>
            <Grid item xs={6}>
              { renderSelect(waterfallMapping) }
            </Grid>
          </Grid>
          <Grid container styleName="list-item">
            <Grid item xs={3}> Case Type </Grid>
            <Grid item xs={3}>
              <Button onClick={() => handleCaseTypeAdd()}>
                <img alt="add_btn" src="/static/img/addplus.svg" />
              </Button>
            </Grid>
          </Grid>
        </Grid>

        { addWaterfallFlag
        && <AddWaterfall /> }
        { addCaseTypeFlag
        && <AddCaseType /> }
      </div>
    </>
  );
};

AdminTool.defaultProps = {
};

AdminTool.propTypes = {
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});


export default connect(mapStateToProps, mapDispatchToProps)(AdminTool);
