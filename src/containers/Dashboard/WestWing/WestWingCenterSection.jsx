import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './WestWingCenterSection.css';
import {
  Grid, Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper, TextField, Button, Tooltip,
} from '@material-ui/core';
import { operations as widgetsOperation, selectors as widgetSelectors } from 'ducks/widgets';
import moment from 'moment-timezone';
import BorrowerIncomeExpense from '../../../components/Widgets/WestWing/BorrowerIncomeExpense';
import WestWingRepayment from './WestWingRepayment';
import WestWingForbearance from './WestWingForbearance';
import LoanDocument from '../../../components/Widgets/WestWing/LoanDocument';
import FCStageDetails from '../../../components/Widgets/WestWing/FCStageDetails';


class WestWingCenterSection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      comments: '',
    };
    this.renderComponent = this.renderComponent.bind(this);
  }

  handleInputChange = (event) => {
    this.setState({
      comments: event.target.value,
    });
  }

  handleSendClick = () => {
    const { idType, saveWestWingForbRepayData, loanNumber } = this.props;
    const { comments } = this.state;
    saveWestWingForbRepayData({ idType, comments, loanNumber });
    this.setState({
      comments: '',
    });
  }


  renderComponent(westWingForbRepayData) {
    const { idType } = this.props;
    let sectionToRender = null;
    switch (idType) {
      case 'Forbearance':
        sectionToRender = <WestWingForbearance data={westWingForbRepayData} />;
        break;
      case 'Repayment Plan':
      case 'Disaster Repayment Plan':
        sectionToRender = <WestWingRepayment data={westWingForbRepayData} />;
        break;
      default:
        sectionToRender = null;
    }
    return sectionToRender;
  }

  render() {
    const {
      westWingForbRepayData,
    } = this.props;
    const { comments } = this.state;
    const disableSendButton = westWingForbRepayData.isDataFromDataService
     || !westWingForbRepayData.fetchStatus;
    return (
      <>
        {
          westWingForbRepayData.fetchStatus
            ? (
              <Grid container direction="column">
                <Grid item>
                  <Grid container style={{ alignItems: 'center' }}>
                    <Grid item xs={10}>
                      <span styleName="header">Eval Detail</span>
                    </Grid>
                    <Grid item xs={1}>
                      <span styleName="decisionTxt">{westWingForbRepayData.isDataFromDataService ? westWingForbRepayData.decision : ''}</span>
                    </Grid>
                    <Grid item xs={1}>
                      <Tooltip title="">
                        <Button
                          className="material-ui-button"
                          color="primary"
                          disabled={disableSendButton}
                          onClick={() => { this.handleSendClick(); }}
                          styleName={disableSendButton ? 'send-disable' : 'send'}
                          variant="contained"
                        >
                          Send
                        </Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  {this.renderComponent(westWingForbRepayData)}
                </Grid>
                <Grid item styleName="containerBackground otherInfo">
                  <BorrowerIncomeExpense
                    borrName={westWingForbRepayData.borrowerNane}
                    data={westWingForbRepayData.customerFinance
                      ? westWingForbRepayData.customerFinance : {
                        incomeData: [],
                        expenseData: [],
                      }}
                  />
                </Grid>
                <Grid item styleName="containerBackground otherInfo">
                  <LoanDocument rows={westWingForbRepayData.documents || []} />
                </Grid>
                <Grid item styleName="containerBackground otherInfo">
                  <FCStageDetails rows={westWingForbRepayData.fcStageDetails || []} />
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
                                {
                                  westWingForbRepayData.comments
                                  && westWingForbRepayData.comments.map(row => (
                                    <TableRow key={row.id}>
                                      <TableCell component="th" scope="row">
                                        {row.comment}
                                      </TableCell>
                                      <TableCell align="left">
                                        {'-'}
                                      </TableCell>
                                      <TableCell align="left">
                                        {row.audCreByNm ? row.audCreByNm : ''}
                                      </TableCell>
                                      <TableCell align="left">
                                        {row.audCreDttm ? moment(row.audCreDttm).format('MM/DD/YYYY') : ''}
                                      </TableCell>
                                    </TableRow>
                                  ))
                                }
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={3}>
                      <Grid container direction="column">
                        <Grid item>
                          <span styleName="commentTitle">Add Service Comments</span>
                        </Grid>
                        <Grid item styleName="textField">
                          <TextField
                            disabled={westWingForbRepayData.isDataFromDataService}
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
                            onChange={(e) => { this.handleInputChange(e); }}
                            placeholder="User Comments here"
                            rows={9}
                            style={{ minWidth: '100%', background: 'white' }}
                            value={westWingForbRepayData.isDataFromDataService
                              ? westWingForbRepayData.dealComment : comments}
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
            )
            : (
              <div styleName="preInfo">
                <span styleName="preInfoText">Processed loan information will be displayed here</span>
              </div>
            )
        }
      </>
    );
  }
}

WestWingCenterSection.propTypes = {
  idType: PropTypes.string.isRequired,
  loanNumber: PropTypes.string.isRequired,
  saveWestWingForbRepayData: PropTypes.func.isRequired,
  westWingForbRepayData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  westWingForbRepayData: widgetSelectors.getWestWingForbRepay(state),
});

const mapDispatchToProps = dispatch => ({
  saveWestWingForbRepayData: widgetsOperation.saveWestWingForbRepayDataOperation(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(WestWingCenterSection);
