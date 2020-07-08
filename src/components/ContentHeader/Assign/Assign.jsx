import React from 'react';
import PropTypes from 'prop-types';
import { selectors, operations } from 'ducks/dashboard';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';
import DashboardModel from 'models/Dashboard';
import './Assign.css';
import SweetAlertBox from '../../SweetAlertBox';

class Assign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({ isOpen: true });
  }

  handleClick() {
    const {
      onAssignLoan, location, onGetGroupName, onAssignToMeClick,
    } = this.props;
    onAssignToMeClick(true);
    const el = DashboardModel.GROUP_INFO.find(page => page.path === location.pathname);
    onGetGroupName(el.group);
    onAssignLoan();
  }

  handleClose() {
    this.setState({ isOpen: false });
    const { assignResult, onDialogClose } = this.props;
    if (assignResult && assignResult.taskData) {
      onDialogClose();
    }
  }

  render() {
    const { assignResult, assigntomeBtnStats } = this.props;
    const { isOpen } = this.state;
    let RenderContent = null;
    let renderComponent = null;
    if (assignResult && assignResult.status) {
      RenderContent = assignResult.status;
      renderComponent = (
        <SweetAlertBox
          message={RenderContent}
          onConfirm={this.handleClose}
          show={isOpen}
          type={assignResult.statusCode}
        />
      );
    }
    return (
      <>
        <Button
          className="material-ui-button"
          color="primary"
          disabled={assigntomeBtnStats}
          onClick={this.handleClick}
          styleName="end-shift"
          variant="outlined"
        >
          ASSIGN TO ME
        </Button>
        {renderComponent}
      </>
    );
  }
}

Assign.defaultProps = {
  onAssignLoan: () => { },
  onDialogClose: () => { },
  assigntomeBtnStats: false,
};

const mapStateToProps = state => ({
  assignResult: selectors.assignResult(state),
  assigntomeBtnStats: selectors.getAssigntomeBtnStats(state),
});

const mapDispatchToProps = dispatch => ({
  onAssignLoan: operations.onAssignLoan(dispatch),
  onDialogClose: operations.onDialogClose(dispatch),
  onGetGroupName: operations.onGetGroupName(dispatch),
  onAssignToMeClick: operations.onAssignToMeClick(dispatch),
});

Assign.propTypes = {
  assignResult: PropTypes.shape({
    cmodProcess: PropTypes.shape({
      taskStatus: PropTypes.string.isRequired,
    }),
    status: PropTypes.string,
    statusCode: PropTypes.string,
    taskData: PropTypes.shape({
      evalId: PropTypes.string.isRequired,
      groupName: PropTypes.string.isRequired,
      loanNumber: PropTypes.string.isRequired,
      processStatus: PropTypes.string.isRequired,
      taskCheckListId: PropTypes.string.isRequired,
      taskCheckListTemplateName: PropTypes.string.isRequired,
      wfProcessId: PropTypes.string.isRequired,
      wfTaskId: PropTypes.string.isRequired,
    }),
  }).isRequired,
  assigntomeBtnStats: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string.isRequired,
  }).isRequired,
  onAssignLoan: PropTypes.func,
  onAssignToMeClick: PropTypes.func.isRequired,
  onDialogClose: PropTypes.func,
  onGetGroupName: PropTypes.func.isRequired,
};

const AssignContainer = connect(mapStateToProps, mapDispatchToProps)(Assign);

export default withRouter(AssignContainer);
