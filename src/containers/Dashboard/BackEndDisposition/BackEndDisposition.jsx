import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';
import UserNotification from 'components/UserNotification/UserNotification';
import DispositionModel from 'models/Disposition';
import { arrayToString } from 'lib/ArrayUtils';
import CardCreator from './CardCreator';
import getStatus from './statusList';
import { selectors, operations } from '../../../state/ducks/dashboard';
import './BackEndDisposition.css';

const shouldExpand = (isExpanded, item, id) => {
  if (isExpanded) return item.id === id;
  return (item.id === id ? false : item.expanded);
};

class BackEndDisposition extends Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.state = {
      status: getStatus(),
      operate: 'ExpandAll',
      selectedStatus: {
        Name: '',
        isExpanded: false,
      },
      selectedActivity: '',
    };
  }

  setSelectionLabel(id, cardStatus, activityName) {
    this.setState({
      selectedStatus: cardStatus,
      selectedActivity: activityName,
    });
    const { status } = this.state;
    const changedStatus = status.map((item) => {
      const tempStatus = {
        ...item,
        labelDisplay: (item.id !== id) ? 'none' : 'block',
      };
      return tempStatus;
    });
    this.setState({ status: changedStatus });
  }

  collapseOthers(id, cardStatus, activityName) {
    this.setState({ selectedStatus: cardStatus, selectedActivity: activityName });
    const { status } = this.state;
    let changedStatus = null;

    changedStatus = status.map((item) => {
      const tempStatus = {
        ...item,
        expanded: shouldExpand(cardStatus.isExpanded, item, id),
      };
      return tempStatus;
    });
    this.setState({ status: changedStatus, operate: 'ExpandAll' });
  }

  handleSave() {
    const { onDispositionSaveTrigger } = this.props;
    const { dispositionReason } = this.props;
    if (dispositionReason) {
      const payload = { dispositionReason: dispositionReason.activityName, group: 'BEUW' };
      onDispositionSaveTrigger(payload);
    }
  }

  handleExpandAll() {
    const {
      operate, status,
    } = this.state;

    const { selectedDisposition } = this.props;
    if (selectedDisposition) {
      const { cardStatus } = selectedDisposition;
      this.setState({ selectedStatus: cardStatus });
    }
    const statuses = status.map(m => ({
      ...m,
      expanded: operate === 'ExpandAll',
    }));
    const changeOperate = operate === 'ExpandAll' ? 'CollapseAll' : 'ExpandAll';
    this.setState({ status: statuses, operate: changeOperate });
  }

  renderErrorNotification(isAssigned, activityName) {
    const {
      beDispositionErrorMessages: errorMessages,
      enableGetNext,
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

    if (!isAssigned) {
      const message = 'WARNING – You are not assigned to this task. Please select “Assign to Me” to begin working.';
      return (
        <UserNotification level="error" message={message} type="alert-box" />
      );
    }

    if (enableGetNext) {
      const dispositionSuccessMessage = `The task has been dispositioned successfully with disposition ${arrayToString([activityName])}`;
      return (
        <UserNotification level="success" message={dispositionSuccessMessage} type="alert-box" />
      );
    }
    return null;
  }

  renderSave(isAssigned) {
    const {
      beDispositionErrorMessages,
      selectedDisposition,
      saveInProgress,
      enableGetNext,
    } = this.props;

    const { activityName } = selectedDisposition;
    if (saveInProgress) {
      return (
        <Loader />
      );
    }
    return (
      <Button
        className="material-ui-button"
        color="primary"
        disabled={!activityName || enableGetNext || !isAssigned}
        onClick={this.handleSave}
        styleName="save-button"
        variant="contained"
      >
        {beDispositionErrorMessages.length ? 'Retry' : 'Save'}
      </Button>
    );
  }

  render() {
    const {
      status, operate, selectedStatus, selectedActivity,
    } = this.state;
    const {
      selectedDisposition, inProgress, enableGetNext, isAssigned,
    } = this.props;
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
    }

    const { activityName } = selectedDisposition;
    const sameDispositionNotSelected = selectedDisposition
    && (selectedDisposition.cardStatus !== selectedStatus
    || selectedDisposition.activityName !== selectedActivity);
    if (sameDispositionNotSelected) {
      const {
        id,
        cardStatus,
        isActivitySelected,
      } = selectedDisposition;
      if (isActivitySelected) {
        this.setSelectionLabel(id, cardStatus, activityName);
      } else {
        this.collapseOthers(id, cardStatus, activityName);
      }
    }

    return (
      <div styleName="scrollable-block">
        <section styleName="disposition-section">
          <header styleName="para-title">
          Select the outcome of your review
          </header>
          {this.renderErrorNotification(isAssigned, activityName)}
          <button
            disabled={enableGetNext || !isAssigned}
            onClick={() => this.handleExpandAll()}
            styleName="OperateButton"
            type="submit"
          >
            {operate}
          </button>
          { status.map(m => (
            <CardCreator
              disabled={enableGetNext || !isAssigned}
              selectedActivity={selectedActivity}
              status={m}
            />
          ))}
          {this.renderSave(isAssigned)}
        </section>
      </div>
    );
  }
}

BackEndDisposition.defaultProps = {
  enableGetNext: false,
  inProgress: false,
  selectedDisposition: {
    cardStatus: {
      Name: '',
      isExpanded: false,
    },
  },
  saveInProgress: false,
  beDispositionErrorMessages: [],
};

BackEndDisposition.propTypes = {
  beDispositionErrorMessages: PropTypes.arrayOf(PropTypes.string),
  dispositionReason: PropTypes.string.isRequired,
  enableGetNext: PropTypes.bool,
  inProgress: PropTypes.bool,
  isAssigned: PropTypes.bool.isRequired,
  onDispositionSaveTrigger: PropTypes.func.isRequired,
  saveInProgress: PropTypes.bool,
  selectedDisposition: PropTypes.shape({
    activityName: PropTypes.string,
    cardStatus: PropTypes.shape({
      isExpanded: PropTypes.bool,
      Name: PropTypes.string,
    }),
    id: PropTypes.string,
    isActivitySelected: PropTypes.bool,
    isExpanded: PropTypes.bool,
  }),
};

const mapStateToProps = state => ({
  selectedDisposition: selectors.selectedDisposition(state),
  dispositionReason: selectors.getDisposition(state),
  beDispositionErrorMessages: DispositionModel.getErrorMessages(
    selectors.getDiscrepancies(state),
  ),
  enableGetNext: selectors.enableGetNext(state),
  isAssigned: selectors.isAssigned(state),
  saveInProgress: selectors.saveInProgress(state),

});

const mapDispatchToProps = dispatch => ({
  onDispositionSaveTrigger: operations.onDispositionSave(dispatch),
});

const BackendDisposition = connect(mapStateToProps, mapDispatchToProps)(BackEndDisposition);

const TestHooks = {
  BackEndDisposition,
};

export default BackendDisposition;

export {
  TestHooks,
};
