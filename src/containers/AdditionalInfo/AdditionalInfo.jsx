import React from 'react';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import ListIcon from '@material-ui/icons/List';
import Typography from '@material-ui/core/Typography';
import * as R from 'ramda';
import { selectors, operations } from '../../state/ducks/dashboard';
import EvalTable from './EvalTable';
import Cards from './Cards';
import DelayChecklistHistoy from '../StagerDashboard/DelayChecklist/DelayChecklistHistory';
import { selectors as stagerSelectors } from '../../state/ducks/stager';
import './AdditionalInfo.css';

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      aria-labelledby={`simple-tab-${index}`}
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      role="tabpanel"
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.defaultProps = {
  value: null,
};

TabPanel.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number,
};

class AdditionalInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
    this.changeSelectedRow = this.changeSelectedRow.bind(this);
  }

  changeSelectedRow = (idx, evalId) => {
    const { evalRowSelect } = this.props;
    evalRowSelect(evalId, idx);
  }

  a11yProps = index => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  })

  renderNoHistory = () => (
    <div styleName="noHistory">
      <span>
        <ListIcon style={{
          color: '#d6d7d8',
          width: '10rem',
          margin: '3rem',
          height: ' 100%',
          opacity: '0.5',
        }}
        />
      </span>
      <span styleName="no-preview-message">No Delay Checklist History Available</span>
    </div>
  )

  render() {
    const {
      evalCaseDetails, index, type, caseDetails, checklistHistory,
    } = this.props;
    let sortedcaseDetailsByDesc = R.sort(R.descend(
      R.compose(
        Number.parseInt,
        R.prop('resolutionId'),
      ),
    ), caseDetails);
    const { value } = this.state;
    if (!R.isEmpty(evalCaseDetails)) {
      if (evalCaseDetails[index] && evalCaseDetails[index].evalId === '0') {
        sortedcaseDetailsByDesc = sortedcaseDetailsByDesc.filter(
          detail => detail.resolutionId === evalCaseDetails[index].resolutionId,
        );
      }
      return (
        <>
          {R.equals(type, 'searchPage') ? (
            <Grid container styleName="header">
              <Grid item styleName="value-style">
                <span> ADDITIONAL INFO </span>
              </Grid>
            </Grid>
          ) : null
          }
          <Grid container styleName="gridContainer">
            <Grid item styleName="evalGrid" xs={6}>
              <EvalTable
                rows={evalCaseDetails}
                selectedIndex={index}
                selectRow={this.changeSelectedRow}
              />
            </Grid>
            <Grid item styleName="card-background " xs={6}>
              <AppBar color="#fffff" position="static" styleName="AppBar">
                <Tabs
                  onChange={(event, newValue) => this.setState({ value: newValue })}
                  TabIndicatorProps={{ style: { background: '#000' } }}
                  value={value}
                  variant="standard"
                >
                  <Tab label="Cases" styleName="cardTab" {...this.a11yProps(0)} />
                  <Tab label="Delay Checklist History" styleName="cardTab" {...this.a11yProps(0)} />
                </Tabs>
              </AppBar>
              <TabPanel index={0} styleName="overFlowStyles" value={value}>
                {
                  sortedcaseDetailsByDesc && sortedcaseDetailsByDesc.map(card => (
                    <Cards
                      key={card.resolutionId}
                      card={R.head(card.cardDetails)}
                      history={card.cardHistoryDetails}
                      resolutionId={card.resolutionId}
                    />
                  ))}
              </TabPanel>
              <TabPanel index={1} styleName="overFlowStyles" value={value}>
                { checklistHistory && R.length(checklistHistory) > 0
                  ? checklistHistory.map(history => (
                    <DelayChecklistHistoy history={history} />
                  )) : this.renderNoHistory()}
              </TabPanel>
            </Grid>
          </Grid>
        </>
      );
    }
    return null;
  }
}

AdditionalInfo.defaultProps = {
  type: '',
};

AdditionalInfo.propTypes = {
  caseDetails: PropTypes.arrayOf(PropTypes.shape({
    cardDetails: PropTypes.arrayOf(PropTypes.shape({
      LoanId: PropTypes.string,
      UserName: PropTypes.string,
    })).isRequired,
    cardHistoryDetails: PropTypes.arrayOf(PropTypes.shape({
      LoanId: PropTypes.string,
      UserName: PropTypes.string,
    })).isRequired,
    evalId: PropTypes.string,
    loanId: PropTypes.string,
    resolutionId: PropTypes.string,
  })).isRequired,
  checklistHistory: PropTypes.arrayOf(PropTypes.shape({
    completedByName: PropTypes.string,
    completedDate: PropTypes.string,
    delayChecklistReason: PropTypes.arrayOf(PropTypes.string),
    taskId: PropTypes.string,
  })).isRequired,
  evalCaseDetails: PropTypes.arrayOf(PropTypes.shape({
    cardDetails: PropTypes.arrayOf(PropTypes.shape({
      LoanId: PropTypes.string,
      UserName: PropTypes.string,
    })).isRequired,
    cardHistoryDetails: PropTypes.arrayOf(PropTypes.shape({
      LoanId: PropTypes.string,
      UserName: PropTypes.string,
    })).isRequired,
    evalHistory: PropTypes.arrayOf(PropTypes.shape({
      ApprovalType: PropTypes.string,
      ChangeType: PropTypes.string,
      EvalId: PropTypes.string,
    })).isRequired,
    evalId: PropTypes.string,
    loanId: PropTypes.string,
    resolutionId: PropTypes.string,
  })).isRequired,
  evalRowSelect: PropTypes.func.isRequired,
  groupName: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  type: PropTypes.string,
};

const TestHooks = {
  AdditionalInfo,
  TabPanel,
};

const mapStateToProps = state => ({
  evalCaseDetails: selectors.getEvalCaseDetails(state),
  caseDetails: selectors.getCaseDetails(state),
  index: selectors.getEvalIndex(state),
  checklistHistory: stagerSelectors.getDelayCheckListHistory(state),
});

const mapDispatchToProps = dispatch => ({
  evalRowSelect: operations.onEvalRowSelect(dispatch),
});

const AdditionalInfoContainer = connect(mapStateToProps, mapDispatchToProps)(AdditionalInfo);
export default AdditionalInfoContainer;

export {
  TestHooks,
};
