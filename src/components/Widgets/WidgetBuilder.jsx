import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { getWidgets, getSelectedWidget } from './WidgetSelects';
import WidgetIcon from './WidgetIcon';
import styles from './WidgetBuilder.css';
import WidgetComponent from './WidgetComponent';
import { selectors, operations } from '../../state/ducks/widgets';

class WidgetBuilder extends Component {
  constructor(props) {
    super(props);
    this.renderComponent = this.renderComponent.bind(this);
    this.renderIcon = this.renderIcon.bind(this);
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
      onWidgetToggle, page, openWidgetList,
    } = this.props;
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

  renderIcon(rightAppBar) {
    const { openWidgetList } = this.props;
    return (
      rightAppBar.length !== 0
      && rightAppBar
      && rightAppBar.map(data => (
        <WidgetIcon
          key={data.id}
          data={data}
          onWidgetClick={event => this.handleWidgetClick(event, data.id)}
          openWidgetList={openWidgetList}
        />
      ))
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
  page: '',
};

WidgetBuilder.propTypes = {
  className: PropTypes.string.isRequired,
  currentWidget: PropTypes.string,
  onWidgetToggle: PropTypes.func.isRequired,
  openWidgetList: PropTypes.arrayOf(PropTypes.string),
  page: PropTypes.string,
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
});

function mapDispatchToProps(dispatch) {
  return {
    onWidgetToggle: operations.onWidgetToggle(dispatch),
  };
}

const WidgetBuilderContainer = connect(mapStateToProps, mapDispatchToProps)(WidgetBuilder);
export default WidgetBuilderContainer;
export { TestHooks };
