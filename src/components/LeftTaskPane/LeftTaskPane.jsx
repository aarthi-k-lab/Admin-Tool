import React from 'react';
import PropTypes from 'prop-types';
import './LeftTaskPane.css';
import CollapseIcon from 'components/Tasks/CollapseIcon';
import LeftParentTasks from 'components/Tasks/LeftParentTasks';

class LeftTaskPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: props.defaultState === 'open' ? props.openWidth : props.closedWidth,
      isCollapsed: props.defaultState !== 'open',
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { isCollapsed } = this.state;
    const { openWidth, closedWidth } = this.props;
    this.setState({
      width: isCollapsed ? openWidth : closedWidth,
      isCollapsed: !isCollapsed,
    });
  }

  render() {
    const { width, isCollapsed } = this.state;
    return (
      <div styleName="stretch-column">
        <div
          id="cmod_taskpane"
          style={{ width }}
          styleName="taskpane"
        >
          <span
            onClick={this.handleClick}
            onKeyPress={() => null}
            role="button"
            styleName={isCollapsed ? 'collapse-icon-closed' : 'collapse-icon-open'}
            tabIndex={0}
          >
            <CollapseIcon
              direction={isCollapsed ? 'right' : 'left'}
            />
          </span>
          <LeftParentTasks isCollapsed={isCollapsed} />
        </div>
      </div>
    );
  }
}

LeftTaskPane.propTypes = {
  closedWidth: PropTypes.string,
  defaultState: PropTypes.string,
  openWidth: PropTypes.string,
};

LeftTaskPane.defaultProps = {
  closedWidth: '4em',
  defaultState: 'open', // or 'closed'
  openWidth: '20em',
};

export default LeftTaskPane;
