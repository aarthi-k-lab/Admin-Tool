import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton } from '@material-ui/core';
import RadioButton from './RadioButton';
import {
  DISPOSITION_OPTIONS, SOI_OPTIONS, MMO_OPTIONS, MMO_SELECTIONS,
} from '../../../../constants/indexer';
import DatePicker from './DatePicker';
import './DialogForm.css';

const DialogForm = ({ values, setValues, isMaLoan }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [disableDate, setDisableDate] = useState(true);
  const [disableToggle, setDisableToggle] = useState(true);
  const [mmoRadioMargin, setMmoRadioMargin] = useState(false);
  useEffect(() => {
    if (values.mmoOption === 'Yes') {
      setDisableDate(false);
      if (values.mmoDate) {
        setDisableToggle(false);
        setIsExpanded(true);
        setMmoRadioMargin(true);
      } else {
        setDisableToggle(true);
        setIsExpanded(false);
        setMmoRadioMargin(false);
      }
    } else {
      setDisableDate(true);
      setValues(
        prevValues => ({ ...prevValues, mmoDate: '', mmoSelection: '' }),
      );
      setIsExpanded(false);
      setDisableToggle(true);
      setMmoRadioMargin(false);
    }
  }, [values.mmoOption, values.mmoDate]);

  return (
    <>
      <RadioButton
        defaultValue=""
        onChange={(e) => {
          setValues(prevValues => ({ ...prevValues, dispositionOption: e.currentTarget.value }));
        }}
        options={DISPOSITION_OPTIONS}
        title="Please select the Disposition option"
        value={values.dispositionOption || ''}
      />
      <div styleName="gridPadding">
        <RadioButton
          defaultValue=""
          onChange={(e) => {
            setValues(prevValues => ({ ...prevValues, soiReceived: e.currentTarget.value }));
          }}
          options={SOI_OPTIONS}
          title="Was a Statement of Information (SOI) received"
          value={values.soiReceived || ''}
        />
      </div>
      {isMaLoan && (
      <div styleName="gridPadding">
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} sm={12} xl={12} xs={12}>
            <span style={{ color: '#4E586E' }} styleName="maQuery">
Was an Executed Mortgage Modification Options (MMO) form received?
            </span>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xl={12} xs={12}>
            <Grid
              container
              spacing={2}
            >
              <Grid item lg={1} md={1} sm={1} xl={1} xs={1}>
                <RadioButton
                  additionalInfo={{ margin: mmoRadioMargin }}
                  defaultValue=""
                  onChange={(e) => {
                    setValues(prevValues => ({ ...prevValues, mmoOption: e.currentTarget.value }));
                  }}
                  options={MMO_OPTIONS}
                  value={values.mmoOption || ''}
                />

              </Grid>
              <Grid
                item
                lg={3}
                md={3}
                sm={3}
                style={{ marginLeft: '25px' }}
                xl={3}
                xs={3}
              >
                <DatePicker
                  disabled={disableDate}
                  onChange={(e) => {
                    setValues(prevValues => ({ ...prevValues, mmoDate: e }));
                  }}
                  value={values.mmoDate}
                />
              </Grid>
              <Grid item lg={2} md={2} sm={2} style={{ marginLeft: '50px' }} xl={2} xs={2}>
                <IconButton
                  disabled={disableToggle}
                  disableRipple
                  onClick={() => {
                    setIsExpanded((prevState) => {
                      setMmoRadioMargin(!prevState);
                      return !prevState;
                    });
                  }}
                  style={disableToggle ? { opacity: '0.5', padding: '12px' } : { opacity: '1', padding: '12px' }}
                >
                  {isExpanded ? <img alt="collapse" src="/static/img/collapse.svg" />
                    : <img alt="expand" src="/static/img/expand.svg" />}
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          {isExpanded && !disableToggle && (
          <RadioButton
            additionalInfo={{ negativeMargin: true }}
            defaultValue=""
            onChange={(e) => {
              setValues(prevValues => (
                { ...prevValues, mmoSelection: e.currentTarget.value }));
            }}
            options={MMO_SELECTIONS}
            title="Please select the MMO Selection"
            value={values.mmoSelection || ''}
          />
          )}
        </Grid>
      </div>
      )}
    </>
  );
};

DialogForm.propTypes = {
  isMaLoan: PropTypes.bool.isRequired,
  setValues: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  values: PropTypes.any.isRequired,
};
export default DialogForm;
