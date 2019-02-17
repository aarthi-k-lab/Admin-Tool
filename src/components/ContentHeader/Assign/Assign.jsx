import React from 'react';
import PropTypes from 'prop-types';
import { selectors, operations } from 'ducks/dashboard';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import DialogBox from '../../DialogBox';
import './Assign.css';

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
    const { onAssignLoan } = this.props;
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
    const { disabled, assignResult } = this.props;
    const { isOpen } = this.state;
    let RenderContent = null;
    let renderComponent = null;
    if (assignResult && assignResult.status) {
      RenderContent = assignResult.status;
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
    ASSIGN TO ME
        </Button>
        { renderComponent }
      </>
    );
  }
}

Assign.defaultProps = {
  disabled: false,
  onAssignLoan: () => {},
  onDialogClose: () => {},
};

const mapStateToProps = state => ({
  assignResult: selectors.assignResult(state),
});

const mapDispatchToProps = dispatch => ({
  onAssignLoan: operations.onAssignLoan(dispatch),
  onDialogClose: operations.onDialogClose(dispatch),
});

Assign.propTypes = {
  assignResult: PropTypes.shape({
    cmodProcess: PropTypes.shape({
      taskStatus: PropTypes.string.isRequired,
    }),
  }).isRequired,
  disabled: PropTypes.bool,
  onAssignLoan: PropTypes.func,
  onDialogClose: PropTypes.func,
};

const AssignContainer = connect(mapStateToProps, mapDispatchToProps)(Assign);

export default AssignContainer;