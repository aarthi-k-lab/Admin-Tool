import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { links } from 'lib/RouteAccess';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { operations, selectors } from '../../state/ducks/dashboard';
import './LeftNav.css';


class LeftNav extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleLandingpage = this.handleLandingpage.bind(this);
  }

  handleLandingpage() {
    const {
      onAutoSave, onEndShift, enableGetNext, evalId, isAssigned,
    } = this.props;
    if (!R.isEmpty(evalId) && !R.isNil(evalId) && (!enableGetNext) && isAssigned) {
      onAutoSave('Paused');
    }
    onEndShift();
  }

  render() {
    const { user } = this.props;
    const groupList = user && user.groupList;
    return (
      <div styleName="stretch-column">
        <nav id="cmod_leftnav" styleName="left-nav-bar">
          {
        links.map(link => (
          groupList && groupList.some(r => link.groups.includes(r))
            ? (
              <Link onClick={this.handleLandingpage} to={link.path}>
                <img alt={link.name} src={link.img} />
              </Link>) : null
        ))
      }
        </nav>
      </div>
    );
  }
}
LeftNav.defaultProps = {
  enableGetNext: false,
};

LeftNav.propTypes = {
  enableGetNext: PropTypes.bool,
  evalId: PropTypes.string.isRequired,
  isAssigned: PropTypes.bool.isRequired,
  onAutoSave: PropTypes.func.isRequired,
  onEndShift: PropTypes.func.isRequired,
  user: PropTypes.shape({
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};

const mapStateToProps = state => ({
  enableGetNext: selectors.enableGetNext(state),
  evalId: selectors.evalId(state),
  isAssigned: selectors.isAssigned(state),
});

const mapDispatchToProps = dispatch => ({
  onAutoSave: operations.onAutoSave(dispatch),
  onEndShift: operations.onEndShift(dispatch),

});
const LeftNavContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LeftNav);

const TestExports = {
  LeftNav,
};
export default LeftNavContainer;
export { TestExports };
