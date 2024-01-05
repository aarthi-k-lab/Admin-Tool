import React, { useEffect, useState } from 'react';
import './CSIFields.css';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import { Box } from '@material-ui/core/index';
import PropTypes from 'prop-types';
import CSIFieldsOption from '../../../constants/admin_portal/csiFields';

const CSIFields = ({ setCSIFieldInCaseType }) => {
  const [csiFields, setCSIFields] = useState([]);

  useEffect(() => {
    setCSIFieldInCaseType(csiFields);
  }, [csiFields]);

  const handleChange = (checkBoxValue, item) => {
    if (checkBoxValue && !csiFields.includes(item)) {
      setCSIFields([...csiFields, item]);
    } else if (!checkBoxValue && csiFields.includes(item)) {
      csiFields.splice(csiFields.indexOf(item), 1);
      setCSIFields([...csiFields]);
    }
  };

  return (
    <>
      <Grid elevation={0} item styleName="card" xs={3}>
        <Grid container styleName="list-item">
          <Grid item xs={12}>
            <div styleName="text-label">Select Fields for Case Specific Information in Case Details</div>
          </Grid>
          <Grid item styleName="field-inline-box-container" xs={12}>
            <div styleName="field-inline-box">
              <div>
                {CSIFieldsOption.map(item => (
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

CSIFields.defaultProps = {
};

CSIFields.propTypes = {
  setCSIFieldInCaseType: PropTypes.func.isRequired,
};

export default CSIFields;
