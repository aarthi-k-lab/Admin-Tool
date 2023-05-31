
import React from 'react';
import { connect } from 'react-redux';
import { operations } from 'ducks/tombstone';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PropTypes from 'prop-types';
import './ReasonableEffortViewIcon.css';
import {
  IconButton,
} from '@material-ui/core/index';

class ReasonableEffortViewIcon extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleCenterPaneView = this.handleCenterPaneView.bind(this);
  }

  handleCenterPaneView() {
    const {
      loanInfoComponent, setChecklistCenterPaneData, fetchReasonableEffortData,
    } = this.props;
    setChecklistCenterPaneData(loanInfoComponent);
    fetchReasonableEffortData();
  }

  render() {
    return (
      <IconButton onClick={this.handleCenterPaneView} size="small" styleName="icon-view">
        <VisibilityIcon />
      </IconButton>
    );
  }
}

ReasonableEffortViewIcon.propTypes = {
  fetchReasonableEffortData: PropTypes.func.isRequired,
  loanInfoComponent: PropTypes.string.isRequired,
  setChecklistCenterPaneData: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  setChecklistCenterPaneData: operations.setChecklistCenterPaneDataOperation(dispatch),
  fetchReasonableEffortData: operations.getReasonableEffortDataOperation(dispatch),
});


export default connect(null, mapDispatchToProps)(ReasonableEffortViewIcon);
