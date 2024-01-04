import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './OverRidableCSIFields.css';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import { Box } from '@material-ui/core/index';
import PropTypes from 'prop-types';

const OverRidableCSIFields = ({ csiFields, setOverRidableCSIFieldInCaseType }) => {
  const [overRidableCSIFields, setOverRidableCSIFields] = useState([]);

  useEffect(() => {
    setOverRidableCSIFieldInCaseType(overRidableCSIFields);
  }, [overRidableCSIFields]);

  const handleChange = (checkBoxValue, item) => {
    if (checkBoxValue && !overRidableCSIFields.includes(item)) {
      setOverRidableCSIFields([...overRidableCSIFields, item]);
    } else if (!checkBoxValue && overRidableCSIFields.includes(item)) {
      overRidableCSIFields.splice(overRidableCSIFields.indexOf(item), 1);
      setOverRidableCSIFields([...overRidableCSIFields]);
    }
  };

  return (
    <>
      <Grid elevation={0} item styleName="card" xs={3}>
        <Grid container styleName="list-item">
          <Grid item xs={12}>
            <div styleName="text-label">Select Overridable Fields for Case Specific Information in Case Details</div>
          </Grid>
          <Grid item styleName="field-inline-box-container" xs={12}>
            <div styleName="field-inline-box">
              <div>
                {csiFields.map(item => (
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

OverRidableCSIFields.defaultProps = {
};

OverRidableCSIFields.propTypes = {
  csiFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOverRidableCSIFieldInCaseType: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});


export default connect(mapStateToProps, mapDispatchToProps)(OverRidableCSIFields);
