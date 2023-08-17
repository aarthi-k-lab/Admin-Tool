import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './WestWingWidget.css';
import { connect } from 'react-redux';
import {
  Grid, Paper, TableRow, TableHead, TextField,
  TableContainer, TableCell, TableBody, Table,
  Button, Tooltip,
} from '@material-ui/core';
import { operations as widgetsOperation, selectors as widgetSelectors } from 'ducks/widgets';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import { makeStyles } from '@material-ui/core/styles';
import BorrowerIncomeExpense from './BorrowerIncomeExpense';
import LoanDocument from './LoanDocument';
import FCStageDetails from './FCStageDetails';

const useStyles = makeStyles(() => ({
  customWidth: {
    maxWidth: 300,
    fontSize: '10px',
  },
}));

function WestWingWidget(props) {
  const {
    fetchWestWingData, westWingWigetData,
    isAssigned, saveWestWing,
  } = props;
  const disableSendButton = !isAssigned
  || westWingWigetData.isDataFromDataService
  || !westWingWigetData.fetchStatus;
  useEffect(() => {
    fetchWestWingData();
  }, []);

  const [comments, setComments] = useState('');
  const classes = useStyles();

  const renderItems = item => (
    <>
      {
          westWingWigetData[item] && westWingWigetData[item].map(({ value, title }) => (
            <Grid item styleName="item">
              <span styleName="title">{title}</span>
              <span styleName="content">
                {
                  value === '' ? '-' : value
                }
              </span>
            </Grid>
          ))
        }
    </>
  );

  const handleSendClick = () => {
    saveWestWing(comments);
  };

  return (
    <div styleName="westWidget">
      <Grid container style={{ alignItems: 'center' }}>
        <Grid item xs={10}>
          <span styleName="header">Eval Detail</span>
        </Grid>
        <Grid item xs={1}>
          <span styleName="decisionTxt">{westWingWigetData.isDataFromDataService ? westWingWigetData.decision : ''}</span>
        </Grid>
        <Grid item xs={1}>
          <Tooltip classes={{ tooltip: classes.customWidth }} title={westWingWigetData.isDataFromDataService ? westWingWigetData.decision : ''}>
            <Button
              className="material-ui-button"
              color="primary"
              disabled={disableSendButton}
              onClick={() => { handleSendClick(); }}
              styleName={disableSendButton ? 'send-disable' : 'send'}
              variant="contained"
            >
                Send
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      <div styleName="westWing">
        <Grid container direction="column" styleName="westWingWidgetContainer">
          <Grid item xs={12}>
            <Grid container direction="row">
              <Grid item styleName="containerBackground" xs={7}>
                <Grid container direction="column" spacing={0} style={{ height: '35rem', marginTop: '1rem' }}>
                  {renderItems('dealDetail')}
                </Grid>
              </Grid>
              <Grid item xs={5}>
                <Grid container direction="column">
                  <Grid item styleName="containerBackground incomeDetails">
                    <span styleName="header">Income Information</span>
                    <Grid container direction="column" style={{ height: '20rem' }}>
                      {renderItems('IncomeInfo')}
                    </Grid>
                  </Grid>
                  <Grid item styleName="containerBackground propertyInfo">
                    <span styleName="header">Trial Information</span>
                    <Grid container direction="column" style={{ height: '10rem' }}>
                      {renderItems('TrialInfo')}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item styleName="containerBackground otherInfo" xs={12}>
            <span styleName="header">Other Information</span>
            <Grid container direction="row" styleName="otherInfoContanier">
              {renderItems('OtherInfo')}
            </Grid>
          </Grid>
          <Grid item styleName="containerBackground otherInfo" xs={12}>
            <Grid container>
              <Grid item xs={6}>
                <span styleName="header">Current Information</span>
                <Grid container direction="column" style={{ height: '23rem' }}>
                  {renderItems('ModCurrentInfo')}
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <span styleName="header">Modification Terms</span>
                <Grid container direction="column" style={{ height: '23rem' }}>
                  {renderItems('ModModificationInfo')}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item styleName="containerBackground otherInfo" xs={12}>
            <span styleName="header">Completed Modification Information</span>
            <Grid container direction="row" styleName="otherInfoContanier">
              {renderItems('completedModificationInfo')}
            </Grid>
          </Grid>
          <Grid item styleName="containerBackground otherInfo" xs={12}>
            <BorrowerIncomeExpense
              borrName={westWingWigetData.borrowerNane}
              data={
              westWingWigetData.westWingBorrowerIncomeExpense
                ? westWingWigetData.westWingBorrowerIncomeExpense : {
                  incomeData: [],
                  expenseData: [],
                }}
            />
          </Grid>
          <Grid item styleName="containerBackground otherInfo" xs={12}>
            <LoanDocument rows={westWingWigetData.documents || []} />
          </Grid>
          <Grid item styleName="containerBackground otherInfo" xs={12}>
            <FCStageDetails rows={westWingWigetData.fcStageDetails || []} />
          </Grid>
          <Grid item styleName="containerBackground otherInfo" xs={12}>
            <span styleName="header">Comments</span>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Grid container direction="column" styleName="comments">
                  <Grid item>
                    <div styleName="westwingTable">
                      <span styleName="title">Eval Comments</span>
                    </div>
                  </Grid>
                  <Grid item>
                    <TableContainer component={Paper} style={{ width: '50rem' }}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="left">Comments</TableCell>
                            <TableCell align="left">User Type</TableCell>
                            <TableCell align="left">Add User</TableCell>
                            <TableCell align="left">Add Time</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody style={{ height: '10rem' }}>
                          {westWingWigetData.comments && westWingWigetData.comments.map(row => (
                            <TableRow key={row.id}>
                              <TableCell component="th" scope="row">
                                {row.comment}
                              </TableCell>
                              <TableCell align="left">
                                {row.comment}
                              </TableCell>
                              <TableCell align="left">
                                {row.addUser ? row.addUser : ''}
                              </TableCell>
                              <TableCell align="left">
                                {row.addTime ? row.addTime : ''}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Grid container direction="column">
                  <Grid item>
                    <span styleName="commentTitle">Add Servicer Comments</span>
                  </Grid>
                  <Grid item styleName="textField">
                    <TextField
                      disabled={westWingWigetData.isDataFromDataService}
                      FormHelperTextProps={{
                        style: {
                          backgroundColor: '#F3F5F9',
                          margin: '0px',
                        },
                      }}
                      helperText={`You have entered ${comments.length} /4000`}
                      id="outlined-multiline-static"
                      inputProps={{ maxLength: 4000 }}
                      multiline
                      onChange={(e) => { setComments(e.target.value); }}
                      placeholder="User Comments here"
                      rows={9}
                      style={{ minWidth: '100%', background: 'white' }}
                      value={westWingWigetData.isDataFromDataService
                        ? westWingWigetData.dealComment : comments}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Grid container direction="column">
                  <Grid item>
                    <span styleName="commentTitle">Add Management Comments</span>
                  </Grid>
                  <Grid item styleName="textField">
                    <TextField
                      disabled
                      FormHelperTextProps={{
                        style: {
                          backgroundColor: '#F3F5F9',
                          margin: '0px',
                        },
                      }}
                      helperText="You have entered 20/4000"
                      id="outlined-multiline-static"
                      inputProps={{ maxLength: 4000 }}
                      multiline
                      placeholder="User Comments here"
                      rows={9}
                      style={{ minWidth: '100%', background: 'white' }}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}


WestWingWidget.propTypes = {
  fetchWestWingData: PropTypes.func.isRequired,
  isAssigned: PropTypes.bool.isRequired,
  saveWestWing: PropTypes.func.isRequired,
  westWingWigetData: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  westWingWigetData: widgetSelectors.getWestWingWidgetData(state),
  isAssigned: dashboardSelectors.isAssigned(state),
});

const mapDispatchToProps = dispatch => ({
  saveWestWing: widgetsOperation.saveWestWingWidgetDataOperation(dispatch),
  fetchWestWingData: widgetsOperation.fetchWestWingWidgetDataOperation(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(WestWingWidget);
