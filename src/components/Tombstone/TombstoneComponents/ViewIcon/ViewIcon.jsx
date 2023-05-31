
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { connect } from 'react-redux';
import { operations, selectors } from 'ducks/tombstone';
import PropTypes from 'prop-types';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import './ViewIcon.css';
import CFPBTableContent from '../CFPBTableContent';


class ViewIcon extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDialogOpen: false,
    };
  }

  handleCenterPaneView = () => {
    const {
      getCFPBTableData, loanNumber,
    } = this.props;
    this.setState({
      isDialogOpen: true,
    });
    getCFPBTableData(loanNumber);
  }

  handleCloseDialog = (isClosed) => {
    this.setState({
      isDialogOpen: isClosed,
    });
  }

  render() {
    const { isDialogOpen } = this.state;
    return (
      <>
        <IconButton onClick={this.handleCenterPaneView} size="small" styleName="icon-view">
          <VisibilityIcon />
        </IconButton>
        {isDialogOpen && (
          <CFPBTableContent
            handleClose={this.handleCloseDialog}
            show={isDialogOpen}
          />
        )
        }
      </>
    );
  }
}

ViewIcon.defaultProps = {
  getCFPBTableData: () => { },
};

ViewIcon.propTypes = {
  getCFPBTableData: PropTypes.func,
  loanNumber: PropTypes.number.isRequired,
};

const mapDispatchToProps = dispatch => ({
  getCFPBTableData: operations.getCFPBTableDataOperation(dispatch),
});

const mapStateToProps = state => ({
  loanNumber: dashboardSelectors.loanNumber(state),
  rfdTableData: selectors.getCFPBTableData(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewIcon);
