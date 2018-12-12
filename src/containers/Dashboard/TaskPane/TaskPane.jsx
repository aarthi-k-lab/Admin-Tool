import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors } from 'ducks/config';
import LeftTaskPane from 'components/LeftTaskPane';

class TaskPane extends React.PureComponent {
  render() {
    const { isAccessible } = this.props;
    return isAccessible ? <LeftTaskPane /> : null;
  }
}

const TestHooks = {
  TaskPane,
};

TaskPane.defaultProps = {
  isAccessible: false,
};

TaskPane.propTypes = {
  isAccessible: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAccessible: selectors.isTaskPaneAccessible(state),
});

const TaskPaneContainer = connect(mapStateToProps)(TaskPane);

export default TaskPaneContainer;
export { TestHooks };
