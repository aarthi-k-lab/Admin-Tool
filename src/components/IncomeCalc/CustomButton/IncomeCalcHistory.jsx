/* eslint-disable no-unused-vars */
import React from 'react';
import * as R from 'ramda';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from '@material-ui/core/Icon';
import Popover from '@material-ui/core/Popover';
import { selectors, operations } from 'ducks/income-calculator';
import { selectors as taskSelectors, utils } from 'ducks/tasks-and-checklist';
import { selectors as widgetsSelectors } from 'ducks/widgets';
import { FINANCIAL_CALCULATOR } from 'constants/widgets';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import HTMLElements from 'constants/componentTypes';


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

  renderDropDownItems = () => {
    const {
      openWidgetList, historyData, disabled, checklistType,
    } = this.props;
    const { AV } = HTMLElements;
    const { getCSTDateTime } = utils;
    const isWidgetOpen = R.contains(FINANCIAL_CALCULATOR, openWidgetList);
    const disableCopy = disabled || isWidgetOpen;
    return (!R.isEmpty(historyData) ? historyData.map((item, index) => (
      <>
        <div style={{ display: 'flex', alignItems: 'end', margin: '1rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>{getCSTDateTime(item.calcDateTime)}</h3>
            {item.lockId ? <h5 style={{ margin: 0, color: 'gray' }}>{item.lockId}</h5>
              : <h5 style={{ margin: 0, color: 'gray' }}>--</h5> }
          </div>
          { checklistType !== AV && (
          <Icon
            color="primary"
            onClick={() => this.handleDuplicateHistoryItem(item)}
            style={{ marginLeft: '1rem', cursor: disableCopy ? 'not-allowed' : 'pointer' }}
          >
        content_copy
          </Icon>
          )
  }
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

  render() {
    const { anchorEl } = this.state;
    const { historyView, historyItem, checklistType } = this.props;
    const { AV } = HTMLElements;
    const { getCSTDateTime } = utils;
    return (
      <div style={{ display: 'flex' }}>
        {(historyView && checklistType !== AV)
          ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {historyItem && <span style={{ marginRight: '1.3rem' }}>{`Showing calculation done on ${getCSTDateTime(historyItem.calcDateTime)} by ${historyItem.calcByUserName.replace('.', ' ').replace('@mrcooper.com', '')}`}</span>}
              <p style={{ margin: 0 }}>Close</p>
              <Icon onClick={this.handleCloseHistoryView} style={{ cursor: 'pointer' }}>close</Icon>
            </div>
          ) : (
            <>
              {checklistType !== AV ? <span style={{ marginRight: '1.3rem' }}>{`Showing calculation done on ${getCurrentDate()}`}</span> : null }
              <Tooltip placement="left" title="Calculation History">
                <Icon
                  onClick={this.handleViewHistory}
                  style={checklistType !== AV ? { cursor: 'pointer' } : { cursor: 'pointer', marginRight: '20rem' }}
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
  checklistType: '',
};


IncomeCalcHistory.propTypes = {
  checklistType: PropTypes.string,
  closeHistoryView: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  duplicateHistoryItem: PropTypes.func.isRequired,
  getHistoryChecklist: PropTypes.func.isRequired,
  historyData: PropTypes.arrayOf(),
  historyItem: PropTypes.shape({
    calcByUserName: PropTypes.string,
    calcDateTime: PropTypes.string,
  }),
  historyView: PropTypes.bool,
  openWidgetList: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = state => ({
  historyData: selectors.getHistory(state),
  historyView: selectors.getHistoryView(state),
  historyItem: selectors.getHistoryItem(state),
  openWidgetList: widgetsSelectors.getOpenWidgetList(state),
  checklistType: taskSelectors.getCurrentChecklistType(state),
});

const mapDispatchToProps = dispatch => ({
  getHistoryChecklist: operations.enableHistoryView(dispatch),
  closeHistoryView: operations.closeHistoryView(dispatch),
  duplicateHistoryItem: operations.duplicateHistoryChecklist(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(IncomeCalcHistory);
