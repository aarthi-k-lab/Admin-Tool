import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DispositionModel from 'models/Disposition';
import CustomSnackBar from 'components/CustomSnackBar';
import { selectors as notificationSelectors, operations as notificationOperations } from 'ducks/notifications';
import Disposition from '../Disposition';
import getStatus from './statusList';
import { selectors } from '../../../state/ducks/dashboard';

class BackEndDisposition extends Component {
  constructor(props) {
    super(props);
    this.saveValidation = this.saveValidation.bind(this);
    this.renderSnackBar = this.renderSnackBar.bind(this);
  }

  saveValidation(content) {
    const { selectedDisposition } = this.props;
    const { activityName } = selectedDisposition;
    const checkDisposition = (activityName === 'Approval' || content !== '');
    const checkApproval = activityName === 'Approval';
    return selectedDisposition && (checkDisposition || checkApproval);
  }

  renderSnackBar() {
    const { snackBarData, closeSnackBar } = this.props;
    return (
      <CustomSnackBar
        message={snackBarData && snackBarData.message}
        onClose={closeSnackBar}
        open={snackBarData && snackBarData.open}
        type={snackBarData && snackBarData.type}
      />
    );
  }

  render() {
    return (
      <>
        {this.renderSnackBar()}
        <Disposition
          saveValidation={this.saveValidation}
          status={getStatus()}
        />
      </>
    );
  }
}

BackEndDisposition.defaultProps = {
  snackBarData: null,
  closeSnackBar: () => {},
  selectedDisposition: {
    cardStatus: {
      Name: '',
      isExpanded: false,
    },
  },
};
BackEndDisposition.propTypes = {
  closeSnackBar: PropTypes.func,
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
  snackBarData: PropTypes.node,
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
  selectedDisposition: selectors.getDisposition(state),
  snackBarData: notificationSelectors.getSnackBarState(state),
  beDispositionErrorMessages: DispositionModel.getErrorMessages(
    selectors.getDiscrepancies(state),
  ),
  enableGetNext: selectors.enableGetNext(state),
  isAssigned: selectors.isAssigned(state),
  showAssign: selectors.showAssign(state),
});

const mapDispatchToProps = dispatch => ({
  closeSnackBar: notificationOperations.closeSnackBar(dispatch),
});

const
  BackEndDispositionContainer = connect(mapStateToProps, mapDispatchToProps)(BackEndDisposition);

const TestHooks = {
  BackEndDisposition,
};
export default BackEndDispositionContainer;
export {
  TestHooks,
};
