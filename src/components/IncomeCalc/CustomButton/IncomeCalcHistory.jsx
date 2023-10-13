/* eslint-disable no-unused-vars */
import React from 'react';
import * as R from 'ramda';
import moment from 'moment-timezone';
import './CustomButton.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from '@material-ui/core/Icon';
import Popover from '@material-ui/core/Popover';
import { selectors, operations } from 'ducks/income-calculator';
import { selectors as widgetsSelectors } from 'ducks/widgets';
import { FINANCIAL_CALCULATOR } from 'constants/widgets';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';


function getCurrentDate() {
  const date = new Date();
  const dateTime = moment(date).format('YYYY-MM-DD');
  return dateTime;
}

class IncomeCalcHistory extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  handleViewHistory = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleDuplicateHistoryItem = (item) => {
    const { taskCheckListId } = item;
    const { duplicateHistoryItem, openWidgetList, disabled } = this.props;
    if (disabled || !R.contains(FINANCIAL_CALCULATOR, openWidgetList)) {
      duplicateHistoryItem(taskCheckListId);
    }
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  }

  handleViewHistoryItem = (item) => {
    const { getHistoryChecklist } = this.props;
    getHistoryChecklist(item);
  }

  handleCloseHistoryView = () => {
    const { closeHistoryView } = this.props;
    closeHistoryView();
  }

  getCSTDateTime = dateTime => (R.isNil(dateTime) ? 'N/A' : moment.utc(dateTime).tz('America/Chicago').format('MM/DD/YYYY'))

  renderDropDownItems = () => {
    const { openWidgetList, historyData, disabled } = this.props;
    const isWidgetOpen = R.contains(FINANCIAL_CALCULATOR, openWidgetList);
    const disableCopy = disabled || isWidgetOpen;
    return (!R.isEmpty(historyData) ? historyData.map((item, index) => (
      <>
        <div style={{ display: 'flex', alignItems: 'end', margin: '1rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>{this.getCSTDateTime(item.calcDateTime)}</h3>
            {item.lockId ? <h5 style={{ margin: 0, color: 'gray' }}>{item.lockId}</h5>
              : <h5 style={{ margin: 0, color: 'gray' }}>--</h5> }
          </div>
          <Icon
            color="primary"
            onClick={() => this.handleDuplicateHistoryItem(item)}
            style={{ marginLeft: '1rem', cursor: disableCopy ? 'not-allowed' : 'pointer' }}
          >
        content_copy
          </Icon>
          <Icon
            color="primary"

            onClick={() => this.handleViewHistoryItem(item)}
            style={{ margin: '0 0.5rem', cursor: 'pointer' }}
          >
visibility

          </Icon>
        </div>
        {index + 1 !== historyData.length && <Divider style={{ height: '1px', margin: '0px 3px' }} />}
      </>
    ))
      : (
        <div style={{ display: 'flex', alignItems: 'end', margin: '1rem' }}>
        No historical checklists are available
        </div>
      ));
  }

  renderIncmVerfImg = () => {
    const { historyItem } = this.props;
    const { incVerStatus } = historyItem;
    if (incVerStatus !== null && (incVerStatus === 'Verified' || incVerStatus === 'Stated')) {
      return (
        <p styleName="verificationStatus">
          <span>
            <img alt={incVerStatus} src={`/static/img/${incVerStatus}Status.png`} style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
          </span>
          {incVerStatus}
        </p>
      );
    }
    return <></>;
  }

  render() {
    const { anchorEl } = this.state;
    const { historyView, historyItem } = this.props;
    return (
      <div style={{ display: 'flex' }}>
        {historyView
          ? (
            <>
              {this.renderIncmVerfImg()}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {historyItem && <span style={{ marginRight: '1.3rem' }}>{`Showing calculation done on ${this.getCSTDateTime(historyItem.calcDateTime)} by ${historyItem.calcByUserName.replace('.', ' ').replace('@mrcooper.com', '')}`}</span>}
                <p style={{ margin: 0 }}>Close</p>
                <Icon onClick={this.handleCloseHistoryView} style={{ cursor: 'pointer' }}>close</Icon>
              </div>
            </>
          ) : (
            <>
              <span style={{ marginRight: '1.3rem' }}>{`Showing calculation done on ${getCurrentDate()}`}</span>
              <Tooltip placement="left" title="Calculation History">
                <Icon
                  onClick={this.handleViewHistory}
                  style={{ cursor: 'pointer' }}
                >
            history
                </Icon>
              </Tooltip>

              <Popover
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                onClose={this.handleClose}
                open={Boolean(anchorEl)}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {this.renderDropDownItems()}
              </Popover>
            </>
          )
        }
      </div>
    );
  }
}

IncomeCalcHistory.defaultProps = {
  historyView: false,
  openWidgetList: [],
  historyData: null,
  historyItem: null,
  disabled: false,
};


IncomeCalcHistory.propTypes = {
  closeHistoryView: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  duplicateHistoryItem: PropTypes.func.isRequired,
  getHistoryChecklist: PropTypes.func.isRequired,
  historyData: PropTypes.arrayOf(),
  historyItem: PropTypes.shape({
    calcByUserName: PropTypes.string,
    calcDateTime: PropTypes.string,
    incVerStatus: PropTypes.string,
  }),
  historyView: PropTypes.bool,
  openWidgetList: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = state => ({
  historyData: selectors.getHistory(state),
  historyView: selectors.getHistoryView(state),
  historyItem: selectors.getHistoryItem(state),
  openWidgetList: widgetsSelectors.getOpenWidgetList(state),
});

const mapDispatchToProps = dispatch => ({
  getHistoryChecklist: operations.enableHistoryView(dispatch),
  closeHistoryView: operations.closeHistoryView(dispatch),
  duplicateHistoryItem: operations.duplicateHistoryChecklist(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(IncomeCalcHistory);
