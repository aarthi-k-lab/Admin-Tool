import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { selectors, operations } from 'ducks/dashboard';
import { selectors as loginSelectors } from 'ducks/login';
import RouteAccess from 'lib/RouteAccess';
import './Unassign.css';
import DialogBox from '../../DialogBox';


class Unassign extends React.Component {
  constructor(props) {
    super(props);
    this.isDialogOpen = false;
    this.state = {
      isOpen: true,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.getStatus = this.getStatus.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({ isOpen: true });
  }

  getStatus() {
    const { unassignResult } = this.props;
    this.isDialogOpen = true;
    if (unassignResult && unassignResult.cmodProcess) {
      switch (unassignResult.cmodProcess.taskStatus) {
        case 'Paused':
          return 'The task has been unassigned from the user.';
        case 'Not Paused':
          return 'A user is currently working on this task and is unable to be unassigned.';
        default:
          return 'Currently one of the services is down. Please try again. If you still facing this issue, please reach to IT team.';
      }
    }
    return 'Currently one of the services is down. Please try again. If you still facing this issue, please reach to IT team.';
  }

  handleClick() {
    const { onUnassignLoan, user } = this.props;
    const groups = user && user.groupList;
    if (RouteAccess.hasManagerDashboardAccess(groups)) {
      onUnassignLoan();
    }
  }

  handleClose() {
    this.setState({ isOpen: false });
    const { unassignResult, onDialogClose } = this.props;
    if (unassignResult.cmodProcess.taskStatus === 'Paused') {
      onDialogClose();
    }
  }

  render() {
    const { disabled, unassignResult } = this.props;
    const { isOpen } = this.state;
    let RenderContent = null;
    let renderComponent = null;
    if (unassignResult && unassignResult.cmodProcess) {
      RenderContent = this.getStatus();
      renderComponent = (
        <DialogBox
          isOpen={isOpen}
          message={RenderContent}
          onClose={this.handleClose}
        />
      );
    }
    return (
      <>
        <Button
          className="material-ui-button"
          color="primary"
          disabled={disabled}
          onClick={this.handleClick}
          styleName="end-shift"
          variant="outlined"
        >
          UNASSIGN
        </Button>
        { renderComponent }
      </>
    );
  }
}

Unassign.defaultProps = {
  disabled: false,
  onDialogClose: () => {},
};

Unassign.propTypes = {
  disabled: PropTypes.bool,
  onDialogClose: PropTypes.func,
  onUnassignLoan: PropTypes.func.isRequired,
  unassignResult: PropTypes.shape({
    cmodProcess: PropTypes.shape({
      taskStatus: PropTypes.string.isRequired,
    }),
  }).isRequired,
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

const mapDispatchToProps = dispatch => ({
  onUnassignLoan: operations.onUnassignLoan(dispatch),
  onDialogClose: operations.onDialogClose(dispatch),
});


const mapStateToProps = state => ({
  evalId: selectors.evalId(state),
  unassignResult: selectors.unassignResult(state),
  user: loginSelectors.getUser(state),
});

const UnassignContainer = connect(mapStateToProps, mapDispatchToProps)(Unassign);

export default UnassignContainer;
