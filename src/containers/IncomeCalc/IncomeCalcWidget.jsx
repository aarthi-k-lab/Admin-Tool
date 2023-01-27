import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';
import { selectors, operations } from 'ducks/income-calculator';
import { selectors as selectorDash } from 'ducks/dashboard';
import ComponentTypes from 'constants/componentTypes';
import './IncomeCalcWidget.css';
import * as R from 'ramda';
import IncomeChecklist from 'components/IncomeCalc/IncomeChecklist';
import { selectors as widgetsSelectors } from 'ducks/widgets';
import {
  FINANCIAL_CALCULATOR,
} from '../../constants/widgets';

class IncomeCalcWidget extends React.Component {
  componentDidMount() {
    const {
      incomeCalcChecklist, openWidgetList, processInstance, type,
    } = this.props;
    if (!R.contains(FINANCIAL_CALCULATOR, openWidgetList)) {
      incomeCalcChecklist({ processInstance, type });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      incomeCalcChecklist, openWidgetList, processInstance, type,
    } = this.props;
    if (!R.contains(FINANCIAL_CALCULATOR, openWidgetList)
    && type !== prevProps.type) {
      incomeCalcChecklist({ processInstance, type });
    }
  }

  render() {
    const {
      inProgress, checklistItems, onChecklistChange, historyView,
      disabledChecklist, openWidgetList, type,
    } = this.props;
    if (inProgress) {
      return (
        <div styleName="income-loader">
          <Loader message="Please Wait" />
        </div>
      );
    }
    if (R.contains(FINANCIAL_CALCULATOR, openWidgetList)) {
      return (
        <div styleName="income-checklist">
          <IncomeChecklist
            checklistItems={checklistItems}
            checklistType={type}
            disabled={disabledChecklist || historyView}
            onChange={onChecklistChange}
            onDelete={this.onDeleteItem}
            styleName="widget"
          />
        </div>
      );
    }

    return (
      <IncomeChecklist
        checklistItems={checklistItems}
        checklistType={type}
        disabled={disabledChecklist || historyView}
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
  disabledChecklist: false,
  openWidgetList: [],
  type: 'income-calculator',

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
  disabledChecklist: PropTypes.bool,
  historyView: PropTypes.bool,
  incomeCalcChecklist: PropTypes.func.isRequired,
  inProgress: PropTypes.bool,
  onChecklistChange: PropTypes.func.isRequired,
  openWidgetList: PropTypes.arrayOf(PropTypes.string),
  processInstance: PropTypes.string.isRequired,
  type: PropTypes.string,
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
  disabledChecklist: selectors.disabledChecklist(state),
  openWidgetList: widgetsSelectors.getOpenWidgetList(state),
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
