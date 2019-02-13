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
    this.isShowDialog = false;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { onAssignLoan } = this.props;
    onAssignLoan();
    this.isShowDialog = true;
  }

  render() {
    const { disabled, assignResult } = this.props;
    let RenderContent = null;
    let renderComponent = null;
    if (assignResult && assignResult.status && this.isShowDialog) {
      RenderContent = assignResult.status;
      renderComponent = <DialogBox isDialogOpen message={RenderContent} />;
      this.isShowDialog = false;
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
};

const mapStateToProps = state => ({
  assignResult: selectors.assignResult(state),
});

const mapDispatchToProps = dispatch => ({
  onAssignLoan: operations.onAssignLoan(dispatch),
});

Assign.propTypes = {
  assignResult: PropTypes.shape({
    cmodProcess: PropTypes.shape({
      taskStatus: PropTypes.string.isRequired,
    }),
  }).isRequired,
  disabled: PropTypes.bool,
  onAssignLoan: PropTypes.func,
};

const AssignContainer = connect(mapStateToProps, mapDispatchToProps)(Assign);

export default AssignContainer;
