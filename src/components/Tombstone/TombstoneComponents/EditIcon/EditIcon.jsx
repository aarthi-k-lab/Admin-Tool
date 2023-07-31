
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import { operations } from 'ducks/tombstone';
import PropTypes from 'prop-types';
import './EditIcon.css';
import { selectors as dashboardSelectors } from 'ducks/dashboard';

class EditIcon extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleCenterPaneView = this.handleCenterPaneView.bind(this);
  }

  handleCenterPaneView() {
    const {
      setChecklistCenterPaneData,
      getRFDTableData, loanNumber,
      loanInfoComponent,
    } = this.props;
    getRFDTableData(loanNumber);
    setChecklistCenterPaneData(loanInfoComponent);
  }

  render() {
    const { group } = this.props;
    const isMilestoneActivityPage = group === 'MA';
    const styleName = isMilestoneActivityPage ? 'edit-disabled' : '';
    return (
      <IconButton onClick={this.handleCenterPaneView} styleName={`${styleName}`}>
        <img alt="edit" src="/static/img/editIcon.png" styleName="icon" />
      </IconButton>
    );
  }
}

EditIcon.defaultProps = {
  getRFDTableData: () => { },
};

EditIcon.propTypes = {
  getRFDTableData: PropTypes.func,
  group: PropTypes.string.isRequired,
  loanInfoComponent: PropTypes.string.isRequired,
  loanNumber: PropTypes.number.isRequired,
  setChecklistCenterPaneData: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  setChecklistCenterPaneData: operations.setChecklistCenterPaneDataOperation(dispatch),
  getRFDTableData: operations.getRFDTableDataOperation(dispatch),
});

const mapStateToProps = state => ({
  loanNumber: dashboardSelectors.loanNumber(state),
  group: dashboardSelectors.groupName(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditIcon);
