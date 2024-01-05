import React, { useEffect, useState } from 'react';
import './RulePage.css';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import { Box } from '@material-ui/core/index';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

const RulePage = ({ setRulesInCaseType }) => {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    setRulesInCaseType(rules);
  }, [rules]);

  const handleChange = (checkBoxValue, item) => {
    if (checkBoxValue && !rules.includes(item)) {
      setRules([...rules, item]);
    } else if (!checkBoxValue && rules.includes(item)) {
      rules.splice(rules.indexOf(item), 1);
      setRules([...rules]);
    }
  };
  return (
    <>
      <Grid elevation={0} item styleName="card" xs={3}>
        <Grid container styleName="list-item">
          <Grid item xs={8}>
            <div styleName="text-label">Assign Rules for the New Case Type</div>
          </Grid>
          <Grid item xs={4}>
            <Button styleName="btn">
              Create New Rule
            </Button>
          </Grid>
          <Grid xs={12}>
            <Accordion styleName="acc-container">
              <AccordionSummary
                aria-controls="panel1a-content"
                expandIcon={<ExpandMore />}
                id="panel1a-header"
              >
                <Typography>New Case Rules</Typography>
              </AccordionSummary>
              <AccordionDetails styleName="acc-details">
                <Grid item styleName="field-inline-box-container" xs={12}>
                  <Box display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, 'No Active HAMP Case'); }} size="small" />
                    <div styleName="checkbox-text">
                      No Active HAMP Case
                    </div>
                  </Box>
                </Grid>
                <Grid item styleName="field-inline-box-container" xs={12}>
                  <Box display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, 'No Application Discrepancy'); }} size="small" />
                    <div styleName="checkbox-text">
                      No Application Discrepancy
                    </div>
                  </Box>
                </Grid>
                <Grid item styleName="field-inline-box-container" xs={12}>
                  <Box display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, 'No Mod Or Trial Based on Loan Type'); }} size="small" />
                    <div styleName="checkbox-text">
                      No Mod Or Trial Based on Loan Type
                    </div>
                  </Box>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion styleName="acc-container">
              <AccordionSummary
                aria-controls="panel1a-content"
                expandIcon={<ExpandMore />}
                id="panel1a-header"
              >
                <Typography>Required Case Rules</Typography>
              </AccordionSummary>
              <AccordionDetails styleName="acc-details">
                <Grid item styleName="field-inline-box-container" xs={12}>
                  <Box display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, 'Original Locked CapModID Required'); }} size="small" />
                    <div styleName="checkbox-text">
                      Original Locked CapModID Required
                    </div>
                  </Box>
                </Grid>
                <Grid item styleName="field-inline-box-container" xs={12}>
                  <Box display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, 'Maturity Date Required'); }} size="small" />
                    <div styleName="checkbox-text">
                      Maturity Date Required
                    </div>
                  </Box>
                </Grid>
                <Grid item styleName="field-inline-box-container" xs={12}>
                  <Box display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, 'Must Be  Unlocked Case'); }} size="small" />
                    <div styleName="checkbox-text">
                      Must Be  Unlocked Case
                    </div>
                  </Box>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion styleName="acc-container">
              <AccordionSummary
                aria-controls="panel1a-content"
                expandIcon={<ExpandMore />}
                id="panel1a-header"
              >
                <Typography>Lock Case Rules</Typography>
              </AccordionSummary>
              <AccordionDetails styleName="acc-details">
                <Grid item styleName="field-inline-box-container" xs={12}>
                  <Box display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, 'Primary Use Must Be Owner Occupied'); }} size="small" />
                    <div styleName="checkbox-text">
                      Primary Use Must Be Owner Occupied
                    </div>
                  </Box>
                </Grid>
                <Grid item styleName="field-inline-box-container" xs={12}>
                  <Box display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, 'Gov Ineligible Due to Insufficient Disposable Income'); }} size="small" />
                    <div styleName="checkbox-text">
                      Gov Ineligible Due to Insufficient Disposable Income
                    </div>
                  </Box>
                </Grid>
                <Grid item styleName="field-inline-box-container" xs={12}>
                  <Box display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, 'Gov Mod Less than or equal to zero Disposable Income'); }} size="small" />
                    <div styleName="checkbox-text">
                    Gov Mod Less than or equal to zero Disposable Income
                    </div>
                  </Box>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion styleName="acc-container">
              <AccordionSummary
                aria-controls="panel1a-content"
                expandIcon={<ExpandMore />}
                id="panel1a-header"
              >
                <Typography>Post Lock Case Rules</Typography>
              </AccordionSummary>
              <AccordionDetails styleName="acc-details">
                <Grid item styleName="field-inline-box-container" xs={12}>
                  <Box display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, 'Rule 296'); }} size="small" />
                    <div styleName="checkbox-text">
                    Rule 296
                    </div>
                  </Box>
                </Grid>
                <Grid item styleName="field-inline-box-container" xs={12}>
                  <Box display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, 'Mod Payment Vs Trial Payment Variance Manager'); }} size="small" />
                    <div styleName="checkbox-text">
                    Mod Payment Vs Trial Payment Variance Manager
                    </div>
                  </Box>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion styleName="acc-container">
              <AccordionSummary
                aria-controls="panel1a-content"
                expandIcon={<ExpandMore />}
                id="panel1a-header"
              >
                <Typography>Send For Approval Rules</Typography>
              </AccordionSummary>
              <AccordionDetails styleName="acc-details">
                <Grid item styleName="field-inline-box-container" xs={12}>
                  <Box display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, 'Case Must be locked'); }} size="small" />
                    <div styleName="checkbox-text">
                    Case Must be locked
                    </div>
                  </Box>
                </Grid>
                <Grid item styleName="field-inline-box-container" xs={12}>
                  <Box display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, 'No Existing Sent for Approval or Approved Cases'); }} size="small" />
                    <div styleName="checkbox-text">
                    No Existing Sent for Approval or Approved Cases
                    </div>
                  </Box>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion styleName="acc-container">
              <AccordionSummary
                aria-controls="panel1a-content"
                expandIcon={<ExpandMore />}
                id="panel1a-header"
              >
                <Typography>Approve Case Rules</Typography>
              </AccordionSummary>
              <AccordionDetails styleName="acc-details">
                <Grid item styleName="field-inline-box-container" xs={12}>
                  <Box display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, 'Must be Sent for Approval to Approve'); }} size="small" />
                    <div styleName="checkbox-text">
                    Must be Sent for Approval to Approve
                    </div>
                  </Box>
                </Grid>
                <Grid item styleName="field-inline-box-container" xs={12}>
                  <Box display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, 'Prev Waterfall case decisioned'); }} size="small" />
                    <div styleName="checkbox-text">
                    Prev Waterfall case decisioned
                    </div>
                  </Box>
                </Grid>
                <Grid item styleName="field-inline-box-container" xs={12}>
                  <Box display="flex">
                    <Checkbox onChange={(e) => { handleChange(e.target.checked, 'Fulfillment Checklist Complete'); }} size="small" />
                    <div styleName="checkbox-text">
                    Fulfillment Checklist Complete
                    </div>
                  </Box>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

RulePage.defaultProps = {
};

RulePage.propTypes = {
  setRulesInCaseType: PropTypes.func.isRequired,
};

export default RulePage;
