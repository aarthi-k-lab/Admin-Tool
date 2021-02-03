import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import * as R from 'ramda';
import {
  getWidgets, getLoanActivityWidgets, getBookingAutomationWidget,
  getSearchLoanWidget, getMilestoneActivityWidgets,
} from './WidgetSelects';
import WidgetIcon from './WidgetIcon';
import styles from './WidgetBuilder.css';
import WidgetComponent from './WidgetComponent';
import { selectors } from '../../state/ducks/dashboard';

class WidgetBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rightAppBarSelected: '',
      rightAppBarOpen: false,
      rightAppBar: getWidgets(),
    };
    this.changeAppBarState = this.changeAppBarState.bind(this);
    this.renderComponent = this.renderComponent.bind(this);
    this.renderIcon = this.renderIcon.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { rightAppBarSelected } = state;
    const { trialHeader, type, milestonePageOpen } = props;
    const isTrialHeader = trialHeader ? trialHeader.trialName : '';

    if (milestonePageOpen && R.isEmpty(rightAppBarSelected)) {
      return {
        rightAppBarSelected: 'History',
        rightAppBar: getMilestoneActivityWidgets(),
        rightAppBarOpen: false,
      };
    }
    if (type === 'search' && R.isEmpty(rightAppBarSelected)) {
      return {
        rightAppBarSelected: 'Additional Info',
        rightAppBar: getSearchLoanWidget(),
        rightAppBarOpen: false,
      };
    }
    if (props.groupName === 'LA' && R.isEmpty(rightAppBarSelected) && isTrialHeader) {
      return {
        rightAppBarSelected: 'customCommunicationLetter',
        rightAppBarOpen: true,
        rightAppBar: getLoanActivityWidgets(),
      };
    }
    if ((props.groupName === 'DOCSIN' || props.groupName === 'BOOKING') && R.isEmpty(rightAppBarSelected)) {
      return {
        rightAppBarSelected: 'BookingAutomation',
        rightAppBar: getBookingAutomationWidget(),
        rightAppBarOpen: false,
      };
    }
    return null;
  }

  handleAdditionalInfo = (event, id) => {
    const { isValid, inSearchPage, isAdditionalInfoOpen } = this.props;
    if ((!isValid && id === 'Additional Info') || (inSearchPage && !isAdditionalInfoOpen && id === 'Comments')) {
      event.stopPropagation();
    } else {
      this.changeAppBarState(id);
    }
  }

  changeAppBarState(widgetId) {
    const { triggerHeader, triggerAI } = this.props;
    const { rightAppBarSelected, rightAppBarOpen } = this.state;
    const oldWidgetId = rightAppBarSelected;
    if (widgetId === oldWidgetId) {
      this.setState({ rightAppBarSelected: null });
      this.setState({ rightAppBarOpen: (widgetId === 'BookingAutomation' || widgetId === 'Additional Info') ? false : !rightAppBarOpen });
      triggerHeader(!rightAppBarOpen, widgetId);
      triggerAI(!rightAppBarOpen, widgetId);
    } else {
      const setrightAppBarOpen = (widgetId === 'BookingAutomation' || widgetId === 'Additional Info');
      this.setState({ rightAppBarOpen: !setrightAppBarOpen, rightAppBarSelected: widgetId });
      triggerHeader(rightAppBarOpen, widgetId);
      triggerAI(rightAppBarOpen, widgetId);
    }
  }

  renderComponent() {
    const { rightAppBarSelected, rightAppBarOpen, rightAppBar } = this.state;
    const { inSearchPage } = this.props;
    const rightAppBarOpened = rightAppBar && rightAppBarSelected
      && rightAppBar.length && rightAppBarOpen;
    return (
      rightAppBarOpened
      && (
        <WidgetComponent id="widget-component" inSearchPage={inSearchPage} rightAppBar={rightAppBar} rightAppBarSelected={rightAppBarSelected} />
      )
    );
  }

  renderIcon() {
    const { rightAppBarSelected, rightAppBarOpen, rightAppBar } = this.state;
    const { isAdditionalInfoOpen, isHistoryOpen, toggleWidget } = this.props;

    return (
      rightAppBar.length !== 0
      && rightAppBar
      && rightAppBar.filter(datas => datas.show).map(data => (
        <WidgetIcon
          key={data.id}
          data={data}
          isAdditionalInfoOpen={isAdditionalInfoOpen}
          isHistoryOpen={isHistoryOpen}
          onWidgetClick={event => this.handleAdditionalInfo(event, data.id)}
          rightAppBarOpen={rightAppBarOpen}
          rightAppBarSelected={rightAppBarSelected}
          toggleWidget={toggleWidget}
        />
      ))
    );
  }

  render() {
    const { rightAppBarOpen } = this.state;
    const { className, type } = this.props;
    return (
      <div className={classNames(className, styles['widget-builder'])} id="widget_builder">
        <div id="widget_builder_container">
          <div
            id="widget_main_center"
            styleName={rightAppBarOpen ? 'widget-main-center-open' : 'widget-main-center-close'}
          />
          {this.renderComponent()}
          {
            <div
              id="show"
              styleName={type === 'search' ? 'showAV' : 'show'}
            >
              {this.renderIcon()}
            </div>
          }
        </div>
      </div>
    );
  }
}

const TestHooks = {
  WidgetBuilder,
};

WidgetBuilder.defaultProps = {
  inSearchPage: false,
  trialHeader: {},
  isValid: true,
  triggerHeader: () => { },
  triggerAI: () => { },
  isAdditionalInfoOpen: false,
  isHistoryOpen: false,
  toggleWidget: false,
};

WidgetBuilder.propTypes = {
  className: PropTypes.string.isRequired,
  inSearchPage: PropTypes.bool,
  isAdditionalInfoOpen: PropTypes.bool,
  isHistoryOpen: PropTypes.bool,
  isValid: PropTypes.bool,
  toggleWidget: PropTypes.bool,
  trialHeader: PropTypes.shape({
    downPayment: PropTypes.number,
    evalId: PropTypes.number,
    fhaTrialLetterReceivedDate: PropTypes.string,
    loanId: PropTypes.number,
    resolutionChoiceType: PropTypes.string,
    resolutionId: PropTypes.number,
    trialAcceptanceDate: PropTypes.string,
    trialName: PropTypes.string,
  }),
  triggerAI: PropTypes.func,
  triggerHeader: PropTypes.func,
  type: PropTypes.string.isRequired,
};
const mapStateToProps = state => ({
  groupName: selectors.groupName(state),
  trialHeader: selectors.getTrialHeader(state),
  isValid: selectors.searchLoanResult(state).valid,
  isAdditionalInfoOpen: selectors.isAdditionalInfoOpen(state),
});

const WidgetBuilderContainer = connect(mapStateToProps, null)(WidgetBuilder);
export default WidgetBuilderContainer;
export { TestHooks };
