import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import getWidgets from './WidgetSelects';
import WidgetIcon from './WidgetIcon';
import styles from './WidgetBuilder.css';
import WidgetComponent from './WidgetComponent';

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

  changeAppBarState(widgetId) {
    const { rightAppBarSelected, rightAppBarOpen } = this.state;
    const oldWidgetId = rightAppBarSelected;
    if (widgetId === oldWidgetId) {
      this.setState({ rightAppBarOpen: !rightAppBarOpen });
    } else {
      this.setState({ rightAppBarOpen: true, rightAppBarSelected: widgetId });
    }
  }

  renderComponent() {
    const { rightAppBarSelected, rightAppBarOpen, rightAppBar } = this.state;
    const rightAppBarOpened = rightAppBar && rightAppBarSelected
    && rightAppBar.length && rightAppBarOpen;
    return (
      rightAppBarOpened
      && (
      <WidgetComponent id="widget-component" rightAppBar={rightAppBar} rightAppBarSelected={rightAppBarSelected} />
      )
    );
  }

  renderIcon() {
    const { rightAppBarSelected, rightAppBarOpen, rightAppBar } = this.state;
    return (
      rightAppBar.length !== 0
      && rightAppBar
      && rightAppBar.filter(datas => datas.show).map(data => (
        <WidgetIcon
          data={data}
          onWidgetClick={() => this.changeAppBarState(data.id)}
          rightAppBarOpen={rightAppBarOpen}
          rightAppBarSelected={rightAppBarSelected}
        />
      ))
    );
  }

  render() {
    const { rightAppBarOpen } = this.state;
    const { className } = this.props;
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
              styleName="show"
            >
              { this.renderIcon() }
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

WidgetBuilder.propTypes = {
  className: PropTypes.string.isRequired,
};

export default WidgetBuilder;
export { TestHooks };
