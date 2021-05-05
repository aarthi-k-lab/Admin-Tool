import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';
import { selectors, operations } from 'ducks/income-calculator';
import { selectors as selectorDash } from 'ducks/dashboard';
import ComponentTypes from 'constants/componentTypes';
import './IncomeCalcWidget.css';
import IncomeChecklist from 'components/IncomeCalc/IncomeChecklist';

class IncomeCalcWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  componentDidMount() {
    const { incomeCalcChecklist } = this.props;
    incomeCalcChecklist();
  }

  // const newChecklistItems = borrower
  // sInfo.map((item, i) => Object.assign({}, item, checklistItems[i]));
  render() {
    const {
      inProgress, checklistItems, onChecklistChange, historyView,
    } = this.props;
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
    }
    return (
      <IncomeChecklist
        checklistItems={checklistItems}
        disabled={historyView}
        onChange={onChecklistChange}
        onDelete={this.onDeleteItem}
        styleName="checklist"
      />
    );
  }
}


IncomeCalcWidget.defaultProps = {
  inProgress: false,
  checklistItems: [],
  historyView: false,
};

IncomeCalcWidget.propTypes = {
  checklistItems: PropTypes.arrayOf(
    PropTypes.shape({
      disabled: PropTypes.bool.isRequired,
      id: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })),
      showPushData: PropTypes.bool,
      taskCode: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.oneOf(Object.values(ComponentTypes)).isRequired,
    }),
  ),
  historyView: PropTypes.bool,
  incomeCalcChecklist: PropTypes.func.isRequired,
  inProgress: PropTypes.bool,
  onChecklistChange: PropTypes.func.isRequired,
};

const TestHooks = {
  IncomeCalcWidget,
};

const mapStateToProps = state => ({
  borrowersInfo: selectors.getBorrowersInfo(state),
  inProgress: selectors.inProgress(state),
  loanNumber: selectorDash.loanNumber(state),
  getIncomeType: selectors.getIncomeType(state),
  getSelectedBorrower: selectors.getSelectedBorrower(state),
  checklistItems: selectors.getChecklistItems(state),
  historyView: selectors.getHistoryView(state),
});

const mapDispatchToProps = dispatch => ({
  incomeCalcChecklist: operations.incomeCalcChecklist(dispatch),
  onChecklistChange: operations.handleChecklistItemValueChange(dispatch),
});

const container = connect(mapStateToProps, mapDispatchToProps)(IncomeCalcWidget);
export default container;
export {
  TestHooks,
};
