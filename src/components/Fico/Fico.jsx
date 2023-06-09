import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import * as R from 'ramda';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import './Fico.css';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import { selectors as incomeCalcSelectors } from 'ducks/income-calculator';
import { selectors as taskChecklistSelectors, operations as taskChecklistOperations } from 'ducks/tasks-and-checklist';
import { IconButton } from '@material-ui/core/index';
import processBorrowerData from '../../lib/CustomFunctions/BorrowerData/processBorrowerData';
import { DECEASED_BORROWER } from '../../constants/incomeCalc/DocumentList';
import { TABLE_SCHEMA } from '../../constants/tableSchema';
import MUITable from '../IncomeCalc/Table';
import AddContributor from '../IncomeCalc/AddContributor/AddContirbutor';

function Fico(props) {
  const {
    getborrowerData, ficoHistoryData, fetchFicoHistory, ficoScoreData,
    setFicoScoreData, isAssigned,
  } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedBorrowerPstn, setSelectedBorrowerPstn] = useState(1);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [selectedFicoScore, setSelectedFicoScore] = useState('');
  const isDisabled = !isAssigned ? 'disable' : '';
  const [showAddContributorPopup, setShowAddContributorPopup] = useState(false);
  const columns = R.propOr([], 'FICO', TABLE_SCHEMA);

  const displayList = processBorrowerData(getborrowerData);

  const handleTabChange = (selectedIndex) => {
    setTabIndex(selectedIndex);
    setSelectedBorrowerPstn(selectedIndex + 1);
    setSelectedHistory(R.filter(R.propEq('position', (selectedIndex + 1)))(ficoHistoryData));
    const selectFico = R.propOr('', 'ficoScore', R.find(R.propEq('position',
      (selectedIndex + 1)))(ficoScoreData));
    if (R.isNil(selectFico) || R.isEmpty(selectFico)) { setSelectedFicoScore(''); } else { setSelectedFicoScore(selectFico); }
  };

  const handleFicoScoreChange = (event) => {
    const inputValue = event.target.value;
    const regex = /^\d*\.?(?:\d{1,2})?$/;
    if (regex.test(inputValue)) {
      const payload = inputValue;
      setSelectedFicoScore(payload);
      setFicoScoreData({ value: payload, position: selectedBorrowerPstn });
    }
  };
  const handAddContributorClick = () => {
    setShowAddContributorPopup(true);
  };

  const handleCloseAddContributor = () => {
    setShowAddContributorPopup(false);
  };
  useEffect(() => {
    fetchFicoHistory();
  }, []);

  useEffect(() => {
    setSelectedHistory(R.filter(R.propEq('position', (tabIndex + 1)))(ficoHistoryData));
    setSelectedFicoScore(R.propOr('', 'ficoScore', R.find(R.propEq('position',
      (tabIndex + 1)))(ficoScoreData)));
  }, [ficoHistoryData]);


  return (
    <div>
      <Paper elevation={1} square styleName="borrowerBanner">
        <Tabs
          inkBarStyle={{ background: '#596feb' }}
          onChange={(_, selectedIndex) => handleTabChange(selectedIndex)}
          scrollable="true"
          style={{ width: 'auto' }}
          value={tabIndex}
          variant="scrollable"
        >
          {displayList && displayList.map(task => (
            <Tab
              key={R.propOr('', 'name', task)}
              disabled={R.propOr('', 'name', task).includes(DECEASED_BORROWER)}
              label={(
                <div styleName="taballign">
                  <div styleName="borrNameDiv">
                    <Typography styleName="borrName" variant="subtitle1">
                      {task && R.propOr('', 'name', task)}
                    </Typography>
                    <Typography styleName="borrDesc" variant="subtitle2">
                      {task && R.propOr('', 'description', task)}
                    </Typography>
                  </div>
                </div>
                )}
              styleName="borrTab"
            />
          ))}
        </Tabs>
      </Paper>
      <div>
        <Grid styleName="gridHandle">
          <Grid style={{ paddingbottom: '0.5rem' }} xs={4}>
            <>
              <Paper styleName="paper">
                <p>
                  <Typography styleName="fico-title">Fico</Typography>
                </p>
                <Grid>
                  <div styleName="align">
                    <div>
                      { <Typography styleName="fico-scr-title">Fico Score</Typography>}
                    </div>
                    <TextField
                      disabled={(R.propOr('', 'name', R.find(R.propEq('pstnNum',
                        (tabIndex + 1)))(displayList))).includes(DECEASED_BORROWER)}
                      margin="dense"
                      onChange={event => handleFicoScoreChange(event)}
                      size="small"
                      styleName={`textalign ${isDisabled}`}
                      value={selectedFicoScore}
                      variant="outlined"
                    />
                  </div>
                  <div styleName="align">
                    <div>
                      { <Typography styleName="fico-scr-title">Date</Typography>}
                    </div>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <KeyboardDatePicker
                        disabled
                        format="MM-DD-YYYY"
                        helperText=""
                        inputVariant="outlined"
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        size="small"
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                </Grid>
              </Paper>
            </>
          </Grid>
          <Grid style={{ paddingbottom: '0.5rem' }} xs={7}>
            <>
              <p>
                <Typography styleName="fico-title">Fico History</Typography>
              </p>
            </>
            <MUITable columns={columns} data={selectedHistory || []} size="small" />
          </Grid>
          <Grid style={{ paddingbottom: '0.5rem' }} xs={1}>
            <IconButton disabled={!isAssigned} onClick={handAddContributorClick} styleName="addContributor">
              <img alt="add-contributor" src="/static/img/person_add.svg" />
            </IconButton>
          </Grid>
          {showAddContributorPopup && <AddContributor checklistType="Fico" onClose={handleCloseAddContributor} />}
        </Grid>
      </div>
    </div>
  );
}

Fico.defaultProps = {
};


Fico.propTypes = {
  fetchFicoHistory: PropTypes.func.isRequired,
  ficoHistoryData: PropTypes.shape().isRequired,
  ficoScoreData: PropTypes.func.isRequired,
  getborrowerData: PropTypes.shape().isRequired,
  isAssigned: PropTypes.bool.isRequired,
  setFicoScoreData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  getborrowerData: incomeCalcSelectors.getBorrowers(state),
  ficoHistoryData: taskChecklistSelectors.getFicoHistoryData(state),
  ficoScoreData: taskChecklistSelectors.getFicoScoreData(state),
  isAssigned: dashboardSelectors.isAssigned(state),
});

const mapDispatchToProps = dispatch => ({
  fetchFicoHistory: taskChecklistOperations.fetchFicoHistoryOperation(dispatch),
  setFicoScoreData: taskChecklistOperations.setFicoScoreOperation(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Fico);
