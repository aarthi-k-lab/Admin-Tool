import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import * as R from 'ramda';
import RadioButtonGroup from 'components/RadioButtonGroup';
import UserNotification from 'components/UserNotification/UserNotification';
import Loader from 'components/Loader/Loader';
import dispositionOptions from 'constants/dispositionOptions';
import { confirmationNavigation } from 'constants/messages';
import { arrayToString } from 'lib/ArrayUtils';
import DispositionModel from 'models/Disposition';
import {
  operations,
  selectors,
} from 'ducks/dashboard';
import './Disposition.css';

class Disposition extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleDispositionSelection = this.handleDispositionSelection.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.confirmNavigation = this.confirmNavigation.bind(this);
  }

  componentWillMount() {
    window.addEventListener('beforeunload', this.confirmNavigation);
  }

  componentWillUnmount() {
    /* istanbul ignore next */
    window.removeEventListener('beforeunload', this.confirmNavigation);
  }

  // eslint-disable-next-line
  confirmNavigation(event) {
    const { enableGetNext, onAutoSave } = this.props;
    /* istanbul ignore else */
    if (!enableGetNext) {
      // eslint-disable-next-line
      event.returnValue = confirmationNavigation;
      onAutoSave();
    }
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
      onDispositionSaveTrigger(dispositionReason);
    }
  }

  renderErrorNotification() {
    const {
      dispositionErrorMessages: errorMessages,
      enableGetNext,
      dispositionReason,
    } = this.props;
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
    if (enableGetNext) {
      const dispositionSuccessMessage = `The task has been dispositioned successfully with disposition ${arrayToString([dispositionReason])}`;
      return (
        <UserNotification level="success" message={dispositionSuccessMessage} type="alert-box" />
      );
    }
    return null;
  }

  renderSave() {
    const {
      dispositionErrorMessages, dispositionReason, saveInProgress, enableGetNext,
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
        disabled={!dispositionReason || enableGetNext}
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
      noTasksFound, dispositionReason, inProgress, enableGetNext, taskFetchError,
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
                {this.renderErrorNotification()}
                <RadioButtonGroup
                  clearSelectedDisposition={R.isEmpty(dispositionReason)}
                  disableDisposition={enableGetNext}
                  items={dispositionOptions}
                  name="disposition-options"
                  onChange={this.handleDispositionSelection}
                />
                {this.renderSave()}
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
  noTasksFound: PropTypes.bool,
  onAutoSave: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onDispositionSaveTrigger: PropTypes.func.isRequired,
  onDispositionSelect: PropTypes.func.isRequired,
  saveInProgress: PropTypes.bool,
  taskFetchError: PropTypes.bool,
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
  taskFetchError: selectors.taskFetchError(state),
});

const mapDispatchToProps = dispatch => ({
  onAutoSave: operations.onAutoSave(dispatch),
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
