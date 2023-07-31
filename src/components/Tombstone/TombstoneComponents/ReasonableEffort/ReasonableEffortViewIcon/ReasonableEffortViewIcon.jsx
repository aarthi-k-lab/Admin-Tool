
import React from 'react';
import { connect } from 'react-redux';
import { operations } from 'ducks/tombstone';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PropTypes from 'prop-types';
import './ReasonableEffortViewIcon.css';
import {
  IconButton,
} from '@material-ui/core/index';
import { selectors as dashboardSelectors } from 'ducks/dashboard';

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
    const { group } = this.props;
    const isMilestoneActivityPage = group === 'MA';
    const styleName = isMilestoneActivityPage ? 'icon-view-disabled' : 'icon-view';
    return (
      <IconButton onClick={this.handleCenterPaneView} size="small" styleName={`${styleName}`}>
        <VisibilityIcon />
      </IconButton>
    );
  }
}

ReasonableEffortViewIcon.propTypes = {
  fetchReasonableEffortData: PropTypes.func.isRequired,
  group: PropTypes.string.isRequired,
  loanInfoComponent: PropTypes.string.isRequired,
  setChecklistCenterPaneData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  group: dashboardSelectors.groupName(state),
});

const mapDispatchToProps = dispatch => ({
  setChecklistCenterPaneData: operations.setChecklistCenterPaneDataOperation(dispatch),
  fetchReasonableEffortData: operations.getReasonableEffortDataOperation(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(ReasonableEffortViewIcon);
