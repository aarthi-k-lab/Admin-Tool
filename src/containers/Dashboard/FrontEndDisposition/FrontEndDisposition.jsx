import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import * as R from 'ramda';
import RadioButtonGroup from 'components/RadioButtonGroup';
import UserNotification from 'components/UserNotification/UserNotification';
import Loader from 'components/Loader/Loader';
import dispositionOptions from 'constants/dispositionOptions';
import { arrayToString } from 'lib/ArrayUtils';
import DispositionModel from 'models/Disposition';
import {
  operations,
  selectors,
} from 'ducks/dashboard';
import { selectors as loginSelectors } from 'ducks/login';
import './FrontEndDisposition.css';
import RouteAccess from 'lib/RouteAccess';

class Disposition extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleDispositionSelection = this.handleDispositionSelection.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleDispositionSelection(option) {
    const { dispositionReason, onDispositionSelect } = this.props;
    const { onClear } = this.props;
    if (dispositionReason && option !== dispositionReason) {
      onClear();
    }
    onDispositionSelect(option);
  }

  handleSave() {
    const { onDispositionSaveTrigger } = this.props;
    const { dispositionReason } = this.props;
    if (dispositionReason) {
      const payload = { dispositionReason, group: 'FEUW' };
      onDispositionSaveTrigger(payload);
    }
  }

  renderErrorNotification(isAssigned) {
    const {
      dispositionErrorMessages: errorMessages,
      enableGetNext,
      dispositionReason,
      showAssign,
      user,
    } = this.props;
    const groups = user && user.groupList;
    if (errorMessages.length > 0) {
      const errorsNode = errorMessages.reduce(
        (acc, message) => {
          acc.push(message);
          acc.push(<br key={message} />);
          return acc;
        },
        [],
      );
      return (
        <UserNotification level="error" message={errorsNode} type="alert-box" />
      );
    }

    if (RouteAccess.hasManagerDashboardAccess(groups) && showAssign) {
      const message = 'Please click Unassign to unassign the task from the user.';
      return (
        <UserNotification level="error" message={message} type="alert-box" />
      );
    }

    if (showAssign) {
      const message = 'Please note only Manager can unassign the task.';
      return (
        <UserNotification level="error" message={message} type="alert-box" />
      );
    }

    if (!isAssigned) {
      const message = 'WARNING – You are not assigned to this task. Please select “Assign to Me” to begin working.';
      return (
        <UserNotification level="error" message={message} type="alert-box" />
      );
    }

    if (enableGetNext) {
      const dispositionSuccessMessage = `The task has been dispositioned successfully with disposition ${arrayToString([dispositionReason])}`;
      return (
        <UserNotification level="success" message={dispositionSuccessMessage} type="alert-box" />
      );
    }
    return null;
  }

  renderSave(isAssigned) {
    const {
      dispositionErrorMessages,
      dispositionReason,
      saveInProgress,
      enableGetNext,
    } = this.props;
    if (saveInProgress) {
      return (
        <Loader />
      );
    }
    return (
      <Button
        className="material-ui-button"
        color="primary"
        disabled={!dispositionReason || enableGetNext || !isAssigned}
        onClick={this.handleSave}
        styleName="save-button"
        variant="contained"
      >
        {dispositionErrorMessages.length ? 'Retry' : 'Save'}
      </Button>
    );
  }

  renderTaskErrorMessage() {
    const { noTasksFound, taskFetchError } = this.props;
    const warningMessage = 'No tasks assigned.Please contact your manager';
    if (taskFetchError) {
      const errorMessage = 'Task Fetch Failed.Please try again Later';
      return (
        <UserNotification level="error" message={errorMessage} type="alert-box" />
      );
    }
    if (noTasksFound) {
      return (
        <UserNotification level="error" message={warningMessage} type="alert-box" />
      );
    }
    return null;
  }

  render() {
    const {
      noTasksFound, dispositionReason, inProgress, enableGetNext,
      taskFetchError, isAssigned,
    } = this.props;
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
    }
    return (
      <div styleName="scrollable-block">
        <section styleName="disposition-section">
          {
            (noTasksFound || taskFetchError) ? this.renderTaskErrorMessage() : (
              <>
                <header styleName="title">Please select the outcome of your review</header>
                {this.renderErrorNotification(isAssigned)}
                <RadioButtonGroup
                  clearSelectedDisposition={R.isEmpty(dispositionReason)}
                  disableDisposition={enableGetNext || !isAssigned}
                  items={dispositionOptions}
                  name="disposition-options"
                  onChange={this.handleDispositionSelection}
                />
                {this.renderSave(isAssigned)}
              </>
            )
          }
        </section>
      </div>
    );
  }
}

Disposition.defaultProps = {
  enableGetNext: false,
  noTasksFound: false,
  taskFetchError: false,
  inProgress: false,
  saveInProgress: false,
};

Disposition.propTypes = {
  dispositionErrorMessages: PropTypes.arrayOf(PropTypes.string).isRequired,
  dispositionReason: PropTypes.string.isRequired,
  enableGetNext: PropTypes.bool,
  inProgress: PropTypes.bool,
  isAssigned: PropTypes.bool.isRequired,
  noTasksFound: PropTypes.bool,
  onClear: PropTypes.func.isRequired,
  onDispositionSaveTrigger: PropTypes.func.isRequired,
  onDispositionSelect: PropTypes.func.isRequired,
  saveInProgress: PropTypes.bool,
  showAssign: PropTypes.bool.isRequired,
  taskFetchError: PropTypes.bool,
  user: PropTypes.shape({
    skills: PropTypes.objectOf(PropTypes.string).isRequired,
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};

const mapStateToProps = state => ({
  dispositionErrorMessages: DispositionModel.getErrorMessages(
    selectors.getDiscrepancies(state),
  ),
  dispositionReason: selectors.getDisposition(state),
  enableGetNext: selectors.enableGetNext(state),
  inProgress: selectors.inProgress(state),
  noTasksFound: selectors.noTasksFound(state),
  saveInProgress: selectors.saveInProgress(state),
  isAssigned: selectors.isAssigned(state),
  taskFetchError: selectors.taskFetchError(state),
  showAssign: selectors.showAssign(state),
  user: loginSelectors.getUser(state),
});

const mapDispatchToProps = dispatch => ({
  onClear: operations.onClearDisposition(dispatch),
  onDispositionSaveTrigger: operations.onDispositionSave(dispatch),
  onDispositionSelect: operations.onDispositionSelect(dispatch),
});

const DispositionContainer = connect(mapStateToProps, mapDispatchToProps)(Disposition);

const TestHooks = {
  Disposition,
};

export default DispositionContainer;

export {
  TestHooks,
};
