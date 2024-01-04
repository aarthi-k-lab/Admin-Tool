import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './AddCaseType.css';
import { Box } from '@material-ui/core/index';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AddModType from '../AddModType/AddModType';
import GIFields from '../GIFields/GIFields';
import CSIFields from '../CSIFields/CSIFields';
import OverRidableGIFields from '../OverRidableGIFields/OverRidableGIFields';
import OverRidableCSIFields from '../OverRidableCSIFields/OverRidableCSIFields';
import RulePage from '../RulePage/RulePage';
import Eligibility from '../Eligibility/Eligibility';

const AddCaseType = () => {
  const [trialCaseFlag, setTrialCaseFlag] = useState(null);
  const [giFieldFlag, setGIFieldFlag] = useState(false);
  const [overRidableGiFieldFlag, setOverRidableGIFieldFlag] = useState(false);
  const [rulePageFlag, setRulePageFlag] = useState(false);
  const [eligibilityFlag, setEligibilityFlag] = useState(false);
  const [completedFlag, setCompletedFlag] = useState(false);

  const [giFields, setGIFields] = useState([]);
  const [csiFields, setCSIFields] = useState([]);
  const [overRidableGIFields, setOverRidableGIFields] = useState([]);
  const [overRidableCSIFields, setOverRidableCSIFields] = useState([]);
  const [rules, setRules] = useState([]);
  const [eligibility, setEligibilty] = useState([]);

  const [nextFlag, setNextFlag] = useState(false);

  useEffect(() => {
  }, []);

  useEffect(() => {
    if ([...giFields, ...csiFields].length > 0) {
      setNextFlag(true);
    } else {
      setNextFlag(false);
    }
  }, [giFields, csiFields]);

  useEffect(() => {
    if ([...rules].length > 0) {
      setNextFlag(true);
    } else {
      setNextFlag(false);
    }
  }, [rules]);

  useEffect(() => {
    if ([...eligibility].length > 0) {
      setNextFlag(true);
      setCompletedFlag(true);
    } else {
      setNextFlag(false);
      setCompletedFlag(false);
    }
  }, [eligibility]);

  useEffect(() => {
    if ([...overRidableGIFields, ...overRidableCSIFields].length > 0) {
      setNextFlag(true);
    } else {
      setNextFlag(false);
    }
  }, [overRidableGIFields, overRidableCSIFields]);

  const handleNext = () => {
    setNextFlag(false);
    if (trialCaseFlag !== null && giFieldFlag === false) {
      setGIFieldFlag(true);
    } else if (giFieldFlag === true && overRidableGiFieldFlag === false) {
      setOverRidableGIFieldFlag(true);
    } else if (overRidableGiFieldFlag === true && rulePageFlag === false) {
      setRulePageFlag(true);
    } else if (rulePageFlag === true && eligibilityFlag === false) {
      setEligibilityFlag(true);
    } else if (eligibilityFlag === true && completedFlag === false) {
      setCompletedFlag(true);
    } else if (completedFlag === true) {
      window.alert('New Case Type Successfully Created');
    }
  };

  return (
    <>
      <Grid elevation={0} item styleName="card" xs={3}>
        <Grid container styleName="list-item">
          <Grid item xs={9}>
            <div styleName="text-label">Add New Case Type</div>
          </Grid>
          <Grid item xs={3}>
            {nextFlag === false
              ? (
                <Button disabled onClick={() => handleNext()}>
                  {eligibilityFlag ? 'SAVE' : 'NEXT' }
                </Button>
              )
              : (
                <Button onClick={() => handleNext()} styleName="btn">
                  {eligibilityFlag ? 'SAVE' : 'NEXT' }
                </Button>
              )}
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
        <Grid container styleName="list-item">
          <Grid item xs={6}> Is it a Trial Case </Grid>
          <Grid item xs={6}>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue=""
              name="radio-buttons-group"
              onChange={(e) => {
                setTrialCaseFlag(e.target.value);
                if (!trialCaseFlag) setNextFlag(true);
              }}
            >
              <Box display="flex">
                <FormControlLabel control={<Radio />} label="Yes" value="Yes" />
                <FormControlLabel control={<Radio />} label="No" value="No" />
              </Box>
            </RadioGroup>
          </Grid>
        </Grid>
        {trialCaseFlag === 'Yes'
          && (
          <Grid container styleName="list-item">
            <Grid item xs={12}>
              <AddModType />
            </Grid>
          </Grid>
          )
        }
      </Grid>
      {giFieldFlag && !overRidableGiFieldFlag
      && (
        <>
          <GIFields setGIFieldInCaseType={value => setGIFields(value)} />
          <CSIFields setCSIFieldInCaseType={value => setCSIFields(value)} />
        </>
      )}
      {overRidableGiFieldFlag && !rulePageFlag
      && (
        <>
          <OverRidableGIFields
            giFields={giFields}
            setOverRidableGIFieldInCaseType={value => setOverRidableGIFields(value)}
          />
          <OverRidableCSIFields
            csiFields={csiFields}
            setOverRidableCSIFieldInCaseType={value => setOverRidableCSIFields(value)}
          />
        </>
      )}
      {rulePageFlag && !eligibilityFlag
      && (
        <>
          <RulePage setRulesInCaseType={value => setRules(value)} />
        </>
      )}

      {eligibilityFlag
        && (
        <>
          <Eligibility setEligibilityInCaseType={value => setEligibilty(value)} />
        </>
        )}
    </>
  );
};

AddCaseType.defaultProps = {
};

AddCaseType.propTypes = {
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});


export default connect(mapStateToProps, mapDispatchToProps)(AddCaseType);
