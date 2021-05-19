import React from 'react';
import * as R from 'ramda';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from '@material-ui/core/Icon';
import Popover from '@material-ui/core/Popover';
import { selectors, operations } from 'ducks/income-calculator';


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
    const { duplicateHistoryItem } = this.props;
    duplicateHistoryItem(taskCheckListId);
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

  getCSTDateTime = dateTime => (R.isNil(dateTime) ? 'N/A' : moment.utc(dateTime).tz('America/Chicago').format('MM/DD/YYYY hh:mm:ss A'))

  renderDropDownItems = historyData => (historyData ? historyData.map(item => (
    <div style={{ display: 'flex', alignItems: 'end', margin: '1rem' }}>
      <div>
        <p style={{ margin: 0 }}>{item.calcByUserName.replace('.', ' ').replace('@mrcooper.com', '')}</p>
        <p style={{ margin: 0 }}>{this.getCSTDateTime(item.calcDateTime)}</p>
      </div>
      <Icon color="primary" onClick={() => this.handleDuplicateHistoryItem(item)} style={{ marginLeft: '1rem', cursor: 'pointer' }}>content_copy</Icon>
      <Icon color="primary" onClick={() => this.handleViewHistoryItem(item)} style={{ margin: '0 0.5rem', cursor: 'pointer' }}>visibility</Icon>
    </div>
  ))
    : (
      <div>
  No historical checklists are available
      </div>
    ))

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
              <Icon
                onClick={this.handleViewHistory}
                style={{ cursor: 'pointer' }}
              >
            history
              </Icon>
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
                {this.renderDropDownItems(historyData)}
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
};


IncomeCalcHistory.propTypes = {
  closeHistoryView: PropTypes.func.isRequired,
  duplicateHistoryItem: PropTypes.func.isRequired,
  getHistoryChecklist: PropTypes.func.isRequired,
  historyData: PropTypes.arrayOf().isRequired,
  historyItem: PropTypes.shape({
    calcByUserName: PropTypes.string,
    calcDateTime: PropTypes.string,
  }).isRequired,
  historyView: PropTypes.bool,
};

const mapStateToProps = state => ({
  historyData: selectors.getHistory(state),
  historyView: selectors.getHistoryView(state),
  historyItem: selectors.getHistoryItem(state),
});

const mapDispatchToProps = dispatch => ({
  getHistoryChecklist: operations.enableHistoryView(dispatch),
  closeHistoryView: operations.closeHistoryView(dispatch),
  duplicateHistoryItem: operations.duplicateHistoryChecklist(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(IncomeCalcHistory);
