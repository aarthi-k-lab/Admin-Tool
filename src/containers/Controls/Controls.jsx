import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  EndShift, Expand, GetNext, Assign, Unassign,
} from 'components/ContentHeader';
import {
  operations,
  selectors,
} from 'ducks/dashboard';
import { selectors as loginSelectors } from 'ducks/login';
import RouteAccess from 'lib/RouteAccess';


class Controls extends React.PureComponent {
  render() {
    const {
      enableEndShift,
      enableGetNext,
      onEndShift,
      onExpand,
      onGetNext,
      showEndShift,
      showGetNext,
      showAssign,
      user,
    } = this.props;
    let assign = null;
    const getNext = showGetNext ? <GetNext disabled={!enableGetNext} onClick={onGetNext} /> : null;
    const endShift = showEndShift ? <EndShift disabled={!enableEndShift} onClick={onEndShift} />
      : null;
    const expand = <Expand onClick={onExpand} />;
    if (showAssign != null && !showAssign) {
      assign = <Assign />;
    }
    const groups = user && user.groupList;
    if (RouteAccess.hasManagerDashboardAccess(groups) && showAssign) {
      assign = <Unassign />;
    }
    return (
      <>
        {assign}
        {endShift}
        {getNext}
        {expand}
      </>
    );
  }
}

Controls.defaultProps = {
  enableEndShift: false,
  enableGetNext: false,
  onEndShift: () => { },
  onExpand: () => { },
  onGetNext: () => { },
  showEndShift: false,
  showGetNext: false,
  showAssign: null,
};

Controls.propTypes = {
  enableEndShift: PropTypes.bool,
  enableGetNext: PropTypes.bool,
  onEndShift: PropTypes.func,
  onExpand: PropTypes.func,
  onGetNext: PropTypes.func,
  showAssign: PropTypes.bool,
  showEndShift: PropTypes.bool,
  showGetNext: PropTypes.bool,
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
  enableEndShift: selectors.enableEndShift(state),
  enableGetNext: selectors.enableGetNext(state),
  showAssign: selectors.showAssign(state),
  user: loginSelectors.getUser(state),
});

const mapDispatchToProps = dispatch => ({
  onExpand: operations.onExpand(dispatch),
  onGetNext: operations.onGetNext(dispatch),
  onEndShift: operations.onEndShift(dispatch),
  onAssignLoan: operations.onAssignLoan(dispatch),
});

const ControlsContainer = connect(mapStateToProps, mapDispatchToProps)(Controls);

const TestHooks = {
  Controls,
};

export default ControlsContainer;
export { TestHooks };
