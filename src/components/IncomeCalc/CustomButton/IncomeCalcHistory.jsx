import React from 'react';
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
    const { taskCheckListId } = item;
    const { getHistoryItem } = this.props;
    getHistoryItem(taskCheckListId);
  }

  handleCloseHistoryView = () => {
    const { closeHistoryView } = this.props;
    closeHistoryView();
  }

  render() {
    const { anchorEl } = this.state;
    const { historyView, historyData } = this.props;
    return (
      <div style={{ display: 'flex' }}>
        {historyView
          ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
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
                {
            historyData && historyData.map(item => (
              <div style={{ display: 'flex', alignItems: 'end', margin: '1rem' }}>
                <div>
                  <p style={{ margin: 0 }}>{item.calcDateTime}</p>
                  <p style={{ margin: 0 }}>{item.calcByUserName}</p>
                </div>
                <Icon color="primary" onClick={() => this.handleDuplicateHistoryItem(item)} style={{ marginLeft: '1rem', cursor: 'pointer' }}>content_copy</Icon>
                <Icon color="primary" onClick={() => this.handleViewHistoryItem(item)} style={{ margin: '0 0.5rem', cursor: 'pointer' }}>visibility</Icon>
              </div>
            ))}
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
  getHistoryItem: PropTypes.func.isRequired,
  historyData: PropTypes.arrayOf().isRequired,
  historyView: PropTypes.bool,
};

const mapStateToProps = state => ({
  historyData: selectors.getHistory(state),
  historyView: selectors.getHistoryView(state),
});

const mapDispatchToProps = dispatch => ({
  getHistoryItem: operations.enableHistoryView(dispatch),
  closeHistoryView: operations.closeHistoryView(dispatch),
  duplicateHistoryItem: operations.duplicateHistoryChecklist(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(IncomeCalcHistory);
