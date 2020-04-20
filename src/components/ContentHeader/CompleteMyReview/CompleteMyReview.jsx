import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './CompleteMyReview.css';
import * as R from 'ramda';
import { selectors, operations } from 'ducks/dashboard';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SweetAlertBox from '../../SweetAlertBox';
import { SOMETHING_WENT_WRONG } from '../../../models/Alert';


class CompleteMyReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }

  handleClose = () => {
    this.setState({ isOpen: false });
    const { completeReviewResponse, onDialogClose } = this.props;
    if (completeReviewResponse) {
      onDialogClose();
    }
  }

  render() {
    const { onClick, completeReviewResponse } = this.props;
    const { isOpen } = this.state;

    let renderComponent = null;
    if (completeReviewResponse && R.prop('error', completeReviewResponse)) {
      renderComponent = (
        <SweetAlertBox
          message={SOMETHING_WENT_WRONG}
          onConfirm={this.handleClose}
          show={isOpen}
          type="Failed"
        />
      );
    }
    return (
      <>
        <Button
          className="material-ui-button"
          color="primary"
          onClick={onClick}
          styleName="continue-my-review"
          variant="contained"
        >
    Complete My Review
        </Button>
        {renderComponent}
      </>
    );
  }
}

CompleteMyReview.defaultProps = {
  onClick: () => {},
};

CompleteMyReview.propTypes = {
  completeReviewResponse: PropTypes.shape.isRequired,
  onClick: PropTypes.func,
  onDialogClose: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  completeReviewResponse: selectors.completeReviewResponse(state),
});

const mapDispatchToProps = dispatch => ({
  onCompleteMyReview: operations.onCompleteMyReview(dispatch),
  onDialogClose: operations.onDialogClose(dispatch),
});

const CompleteMyReviewContainer = connect(mapStateToProps, mapDispatchToProps)(CompleteMyReview);

export default withRouter(CompleteMyReviewContainer);
