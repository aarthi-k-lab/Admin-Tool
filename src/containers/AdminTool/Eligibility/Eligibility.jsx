import React, { useEffect, useState } from 'react';
import './Eligibilty.css';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import { Box } from '@material-ui/core/index';
import PropTypes from 'prop-types';
import EligibiltyOption from '../../../constants/admin_portal/eligibility';

const Eligibility = ({ setEligibilityInCaseType }) => {
  const [eligibilty, setEligibility] = useState([]);

  useEffect(() => {
    setEligibilityInCaseType(eligibilty);
  }, [eligibilty]);

  const handleChange = (checkBoxValue, item) => {
    if (checkBoxValue && !eligibilty.includes(item)) {
      setEligibility([...eligibilty, item]);
    } else if (!checkBoxValue && eligibilty.includes(item)) {
      eligibilty.splice(eligibilty.indexOf(item), 1);
      setEligibility([...eligibilty]);
    }
  };
  return (
    <>
      <Grid elevation={0} item styleName="card" xs={3}>
        <Grid container styleName="list-item">
          <Grid item xs={12}>
            <div styleName="text-label">Assign Eligibility for the New Case Type</div>
          </Grid>
          <Grid item xs={12}>
            <div styleName="text-label">Select all the Eligibility pertaining for this Case Type</div>
          </Grid>
          <Grid styleName="box-content" xs={12}>
            {EligibiltyOption.map(item => (
              <Box key={item} display="flex">
                <Checkbox onChange={(e) => { handleChange(e.target.checked, item); }} size="small" />
                <div styleName="checkbox-text">
                  {item}
                </div>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

Eligibility.defaultProps = {
};

Eligibility.propTypes = {
  setEligibilityInCaseType: PropTypes.func.isRequired,
};

export default Eligibility;
