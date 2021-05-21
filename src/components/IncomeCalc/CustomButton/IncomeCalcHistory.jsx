/* eslint-disable no-unused-vars */
import React from 'react';
import * as R from 'ramda';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from '@material-ui/core/Icon';
import Popover from '@material-ui/core/Popover';
import { selectors, operations } from 'ducks/income-calculator';
import { selectors as widgetsSelectors } from 'ducks/widgets';
import { INCOME_CALCULATOR } from 'constants/widgets';
import Tooltip from '@material-ui/core/Tooltip';

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
    const { duplicateHistoryItem, openWidgetList } = this.props;
    if (!R.contains(INCOME_CALCULATOR, openWidgetList)) {
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
    const { closeHistoryView, openWidgetList } = this.props;
    closeHistoryView(R.contains(INCOME_CALCULATOR, openWidgetList));
  }

  getCSTDateTime = dateTime => (R.isNil(dateTime) ? 'N/A' : moment.utc(dateTime).tz('America/Chicago').format('MM/DD/YYYY hh:mm:ss A'))

  renderDropDownItems = () => {
    const { openWidgetList, historyData } = this.props;
    const isWidgetOpen = R.contains(INCOME_CALCULATOR, openWidgetList);
    return (!R.isEmpty(historyData) ? historyData.map(item => (
      <div style={{ display: 'flex', alignItems: 'end', margin: '1rem' }}>
        <div>
          <p style={{ margin: 0 }}>{item.calcByUserName.replace('.', ' ').replace('@mrcooper.com', '')}</p>
          <p style={{ margin: 0 }}>{this.getCSTDateTime(item.calcDateTime)}</p>
        </div>
        <Icon
          color="primary"
          onClick={() => this.handleDuplicateHistoryItem(item)}
          style={{ marginLeft: '1rem', cursor: isWidgetOpen ? 'not-allowed' : 'pointer' }}
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
    ))
      : (
        <div style={{ display: 'flex', alignItems: 'end', margin: '1rem' }}>
        No historical checklists are available
        </div>
      ));
  }

  render() {
    const { anchorEl } = this.state;
    const { historyView, historyData, historyItem } = this.props;
    return (
      <div style={{ display: 'flex' }}>
        {historyView
          ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {historyItem && <span style={{ marginRight: '1.3rem' }}>{`Showing calculation done on ${this.getCSTDateTime(historyItem.calcDateTime)} by ${historyItem.calcByUserName.replace('.', ' ').replace('@mrcooper.com', '')}`}</span>}
              <p style={{ margin: 0 }}>Close</p>
              <Icon onClick={this.handleCloseHistoryView} style={{ cursor: 'pointer' }}>close</Icon>
            </div>
          ) : (
            <>
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
};


IncomeCalcHistory.propTypes = {
  closeHistoryView: PropTypes.func.isRequired,
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
});

const mapDispatchToProps = dispatch => ({
  getHistoryChecklist: operations.enableHistoryView(dispatch),
  closeHistoryView: operations.closeHistoryView(dispatch),
  duplicateHistoryItem: operations.duplicateHistoryChecklist(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(IncomeCalcHistory);
