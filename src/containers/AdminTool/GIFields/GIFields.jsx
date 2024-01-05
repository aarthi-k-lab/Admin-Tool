import React, { useEffect, useState } from 'react';
import './GIFields.css';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import { Box } from '@material-ui/core/index';
import PropTypes from 'prop-types';
import GIFieldsOption from '../../../constants/admin_portal/giFields';

const GIFields = ({ setGIFieldInCaseType }) => {
  const [giFields, setGIFields] = useState([]);
  useEffect(() => {
    setGIFieldInCaseType(giFields);
  }, [giFields]);

  const handleChange = (checkBoxValue, item) => {
    if (checkBoxValue && !giFields.includes(item)) {
      setGIFields([...giFields, item]);
    } else if (!checkBoxValue && giFields.includes(item)) {
      giFields.splice(giFields.indexOf(item), 1);
      setGIFields([...giFields]);
    }
  };

  return (
    <>
      <Grid elevation={0} item styleName="card" xs={3}>
        <Grid container styleName="list-item">
          <Grid item xs={12}>
            <div styleName="text-label">Select Fields for General Information in Case Details</div>
          </Grid>
          <Grid item styleName="field-inline-box-container" xs={12}>
            <div styleName="field-inline-box">
              <div>
                {GIFieldsOption.map(item => (
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

GIFields.defaultProps = {
};

GIFields.propTypes = {
  setGIFieldInCaseType: PropTypes.func.isRequired,
};

export default GIFields;
