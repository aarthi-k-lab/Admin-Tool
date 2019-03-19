import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DispositionModel from 'models/Disposition';
import Disposition from '../Disposition';
import getStatus from './statusList';
import { selectors } from '../../../state/ducks/dashboard';

class DocProcessing extends Component {
  constructor(props) {
    super(props);
    this.saveValidation = this.saveValidation.bind(this);
  }

  saveValidation(content) {
    const { selectedDisposition } = this.props;
    const { activityName } = selectedDisposition;
    const checkDisposition = (activityName === 'Approval' || content !== '');
    const checkApproval = activityName === 'Approval';
    return selectedDisposition && (checkDisposition || checkApproval);
  }

  render() {
    return (
      <Disposition
        saveValidation={this.saveValidation}
        status={getStatus()}
      />
    );
  }
}

DocProcessing.defaultProps = {
  selectedDisposition: {
    cardStatus: {
      Name: '',
      isExpanded: false,
    },
  },
};
DocProcessing.propTypes = {
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
  beDispositionErrorMessages: DispositionModel.getErrorMessages(
    selectors.getDiscrepancies(state),
  ),
  enableGetNext: selectors.enableGetNext(state),
  isAssigned: selectors.isAssigned(state),
  showAssign: selectors.showAssign(state),
});

const DocProcessingContainer = connect(mapStateToProps, null)(DocProcessing);
const TestHooks = {
  DocProcessing,
};
export default DocProcessingContainer;
export {
  TestHooks,
};
