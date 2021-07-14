import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as R from 'ramda';
import EndShift from 'models/EndShift';
import { selectors as widgetsSelectors, operations as widgetsOperations } from 'ducks/widgets';
import { closeWidgets } from 'components/Widgets/WidgetSelects';
import { BOOKING } from 'constants/widgets';
import { operations, selectors } from '../state/ducks/dashboard';
import Auth from '../lib/Auth';


class HandleBrowserEvent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.confirmNavigation = this.confirmNavigation.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.confirmNavigation);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.confirmNavigation);
  }

  confirmNavigation(event) {
    const {
      onAutoSave,
      onEndShift,
      enableGetNext,
      evalId,
      isAssigned,
      onWidgetToggle,
      groupName,
      openWidgetList,
    } = this.props;
    if (R.equals(groupName, 'DOCSIN')) {
      const widgetsToBeClosed = {
        openWidgetList,
        page: groupName,
        closingWidgets: [BOOKING],
      };
      const payload = {
        currentWidget: '',
        openWidgetList: closeWidgets(widgetsToBeClosed),
      };
      onWidgetToggle(payload);
    }

    if (Auth.isReportTokenValid()) {
      event.preventDefault();
      // eslint-disable-next-line no-param-reassign
      event.returnValue = '';
    }
    if (!R.isEmpty(evalId) && !R.isNil(evalId) && (!enableGetNext) && isAssigned) {
      onAutoSave('Paused');
    }
    setTimeout(() => onEndShift(EndShift.CLEAR_DASHBOARD_DATA), 0);
  }

  render() {
    return null;
  }
}
HandleBrowserEvent.defaultProps = {
  enableGetNext: false,
  evalId: '',
  groupName: '',
  openWidgetList: [],
};
HandleBrowserEvent.propTypes = {
  enableGetNext: PropTypes.bool,
  evalId: PropTypes.string,
  groupName: PropTypes.string,
  isAssigned: PropTypes.bool.isRequired,
  onAutoSave: PropTypes.func.isRequired,
  onEndShift: PropTypes.func.isRequired,
  onWidgetToggle: PropTypes.func.isRequired,
  openWidgetList: PropTypes.arrayOf(PropTypes.string),
};
const mapStateToProps = state => ({
  enableGetNext: selectors.enableGetNext(state),
  evalId: selectors.evalId(state),
  isAssigned: selectors.isAssigned(state),
  groupName: selectors.groupName(state),
  openWidgetList: widgetsSelectors.getOpenWidgetList(state),
});

const mapDispatchToProps = dispatch => ({
  onAutoSave: operations.onAutoSave(dispatch),
  onEndShift: operations.onEndShift(dispatch),
  onWidgetToggle: widgetsOperations.onWidgetToggle(dispatch),
});

const HandleBrowserEventContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HandleBrowserEvent);

export default HandleBrowserEventContainer;
