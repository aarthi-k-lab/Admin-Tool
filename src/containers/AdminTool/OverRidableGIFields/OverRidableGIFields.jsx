import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './OverRidableGIFields.css';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import { Box } from '@material-ui/core/index';
import PropTypes from 'prop-types';

const OverRidableGIFields = ({ giFields, setOverRidableGIFieldInCaseType }) => {
  const [overRidableGIFields, setOverRidableGIFields] = useState([]);
  useEffect(() => {
    setOverRidableGIFieldInCaseType(overRidableGIFields);
  }, [overRidableGIFields]);

  const handleChange = (checkBoxValue, item) => {
    if (checkBoxValue && !overRidableGIFields.includes(item)) {
      setOverRidableGIFields([...overRidableGIFields, item]);
    } else if (!checkBoxValue && overRidableGIFields.includes(item)) {
      overRidableGIFields.splice(overRidableGIFields.indexOf(item), 1);
      setOverRidableGIFields([...overRidableGIFields]);
    }
  };

  return (
    <>
      <Grid elevation={0} item styleName="card" xs={3}>
        <Grid container styleName="list-item">
          <Grid item xs={12}>
            <div styleName="text-label">Select Overridable fields for General Information in Case Details</div>
          </Grid>
          <Grid item styleName="field-inline-box-container" xs={12}>
            <div styleName="field-inline-box">
              <div>
                {giFields.map(item => (
                  <Box key={item} display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, item); }} size="small" />
                    <div styleName="checkbox-text">
                      {item}
                    </div>
                  </Box>
                ))}
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

OverRidableGIFields.defaultProps = {
};

OverRidableGIFields.propTypes = {
  giFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOverRidableGIFieldInCaseType: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});


export default connect(mapStateToProps, mapDispatchToProps)(OverRidableGIFields);
