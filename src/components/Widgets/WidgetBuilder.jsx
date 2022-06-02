import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { FHLMC } from 'constants/widgets';
import { getWidgets, getSelectedWidget } from './WidgetSelects';
import WidgetIcon from './WidgetIcon';
import styles from './WidgetBuilder.css';
import WidgetComponent from './WidgetComponent';
import { selectors, operations } from '../../state/ducks/widgets';
import { selectors as dashboardSelectors } from '../../state/ducks/dashboard';
import { selectors as loginSelectors } from '../../state/ducks/login';

class WidgetBuilder extends Component {
  constructor(props) {
    super(props);
    this.renderComponent = this.renderComponent.bind(this);
    this.renderIcon = this.renderIcon.bind(this);
    this.checkDependency = this.checkDependency.bind(this);
    this.renderWidgetIcon = this.renderWidgetIcon.bind(this);
  }

  componentDidMount() {
    const { page, onWidgetToggle } = this.props;
    const widgets = getWidgets(page);
    const openWidgetList = R.compose(
      R.map(widget => widget.id),
      R.filter(widget => R.prop('defaultOpen', widget)),
    )(widgets);
    if (!R.isEmpty(openWidgetList)) {
      const payload = {
        currentWidget: R.last(openWidgetList),
        openWidgetList,
        page,
      };
      onWidgetToggle(payload);
    }
  }

  handleWidgetClick = (event, widgetId) => {
    const {
      onWidgetToggle, page, openWidgetList, disabledWidgets,
    } = this.props;
    if (!R.contains(widgetId, disabledWidgets)) {
      const widgets = getWidgets(page);
      const selectedWidgetData = getSelectedWidget(widgetId, page);
      let currentAppBarSelected = R.clone(openWidgetList);
      if (R.contains(widgetId, openWidgetList)) {
        if (selectedWidgetData.overlay) {
          // remove current widget from array.
          currentAppBarSelected = R.without(widgetId, currentAppBarSelected);
        } else {
          // Close all widgets except overlay widgets
          currentAppBarSelected = R.filter(widget => R.propOr(false, 'overlay', R.find(R.propEq('id', widget), widgets)), currentAppBarSelected);
          if (selectedWidgetData.children) {
            currentAppBarSelected = R.without(selectedWidgetData.children, currentAppBarSelected);
          }
        }
      } else if (selectedWidgetData.overlay) {
        currentAppBarSelected.push(widgetId);
      } else {
        currentAppBarSelected = [widgetId];
      }

      let currentUpdatedWidget = '';
      if (R.contains(widgetId, openWidgetList)) {
        if (!R.isEmpty(currentAppBarSelected)) {
          currentUpdatedWidget = R.last(currentAppBarSelected);
        }
      } else {
        currentUpdatedWidget = widgetId;
      }
      const payload = {
        currentWidget: currentUpdatedWidget,
        openWidgetList: currentAppBarSelected,
        page,
      };
      onWidgetToggle(payload);
    }
  }

  // TODO: optimize
  checkDependency(data, disabledWidgets, openWidgetList) {
    const {
      resolutionId, groupName, investorHierarchy, investorCode,
      brandName,
    } = this.props;
    const rpsInvstrCode = ['LHA', 'LH8'];
    switch (data.dependency) {
      case FHLMC:
        if (!R.isNil(resolutionId) && R.equals(investorHierarchy.levelName, 'Freddie') && R.equals(investorHierarchy.levelNumber, 3)
          && !R.equals(brandName, 'RPS') && (investorCode && !rpsInvstrCode.includes(investorCode))) {
          if (!R.equals(groupName, 'POSTMOD')) {
            return this.renderWidgetIcon(data, disabledWidgets, openWidgetList);
          }
          return R.equals('INVSET', groupName) ? this.renderWidgetIcon(data, disabledWidgets, openWidgetList) : null;
        }
        return null;
      default:
        return null;
    }
  }

  renderWidgetIcon(data, disabledWidgets, openWidgetList) {
    return (
      <WidgetIcon
        key={data.id}
        data={data}
        disabledWidgets={disabledWidgets}
        onWidgetClick={event => this.handleWidgetClick(event, data.id)}
        openWidgetList={openWidgetList}
      />
    );
  }

  renderIcon(rightAppBar) {
    const { openWidgetList, disabledWidgets } = this.props;
    return (
      rightAppBar.length !== 0
      && rightAppBar
      && rightAppBar.map(data => (
        (R.isNil(data.dependency))
          ? this.renderWidgetIcon(data, disabledWidgets, openWidgetList)
          : this.checkDependency(data, disabledWidgets, openWidgetList)
      ))
    );
  }

  renderComponent(rightAppBar, page) {
    const { currentWidget } = this.props;
    return (
      currentWidget !== ''
      && (
        <WidgetComponent
          currentWidget={currentWidget}
          id="widget-component"
          page={page}
          rightAppBar={rightAppBar}
        />
      )
    );
  }

  render() {
    const {
      className, page, currentWidget,
    } = this.props;
    const rightAppBar = getWidgets(page);
    return (
      <div className={classNames(className, styles['widget-builder'])} id="widget_builder">
        <div id="widget_builder_container">
          <div
            id="widget_main_center"
            styleName={currentWidget !== '' ? 'widget-main-center-open' : 'widget-main-center-close'}
          />
          {this.renderComponent(rightAppBar, page)}
          {
            <div
              id="show"
              styleName={page === 'SEARCH_LOAN' ? 'showAV' : 'show'}
            >
              {this.renderIcon(rightAppBar)}
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
  trialHeader: {},
  currentWidget: '',
  openWidgetList: [],
  disabledWidgets: [],
  page: '',
  resolutionId: null,
  groupName: '',
  investorHierarchy: {},
};

WidgetBuilder.propTypes = {
  brandName: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  currentWidget: PropTypes.string,
  disabledWidgets: PropTypes.arrayOf(PropTypes.string),
  groupName: PropTypes.string,
  investorCode: PropTypes.string.isRequired,
  investorHierarchy: PropTypes.shape(),
  onWidgetToggle: PropTypes.func.isRequired,
  openWidgetList: PropTypes.arrayOf(PropTypes.string),
  page: PropTypes.string,
  resolutionId: PropTypes.func,
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
};

const mapStateToProps = state => ({
  currentWidget: selectors.getCurrentWidget(state),
  openWidgetList: selectors.getOpenWidgetList(state),
  disabledWidgets: selectors.getDisabledWidgets(state),
  resolutionId: dashboardSelectors.resolutionId(state),
  groupName: dashboardSelectors.groupName(state),
  investorHierarchy: dashboardSelectors.getInvestorHierarchy(state),
  isRPSUser: loginSelectors.isRPSGroupPresent(state),
  investorCode: dashboardSelectors.getInvestorCode(state),
  brandName: dashboardSelectors.brand(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onWidgetToggle: operations.onWidgetToggle(dispatch),
  };
}

const WidgetBuilderContainer = connect(mapStateToProps, mapDispatchToProps)(WidgetBuilder);
export default WidgetBuilderContainer;
export { TestHooks };
