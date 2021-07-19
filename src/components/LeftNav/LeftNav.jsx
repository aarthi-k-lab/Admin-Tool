import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { links, shouldShowIcon } from 'lib/RouteAccess';
import { connect } from 'react-redux';
import * as R from 'ramda';
import classNames from 'classnames';
import EndShift from 'models/EndShift';
import { operations, selectors } from '../../state/ducks/dashboard';
import { selectors as configSelectors } from '../../state/ducks/config';
import { operations as stagerOperations } from '../../state/ducks/stager';

import styles from './LeftNav.css';

class LeftNav extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleLandingpage = this.handleLandingpage.bind(this);
  }

  static getIconStyle(currentPath, path) {
    const isActive = R.equals(currentPath, path);
    return classNames({
      [styles['active-bar']]: isActive,
    });
  }

  handleLandingpage(path) {
    const {
      onAutoSave,
      onEndShift,
      enableGetNext,
      evalId,
      isAssigned,
      onClearStagerResponse,
      onClearStagerTaskName,
    } = this.props;
    if (!R.isEmpty(evalId) && !R.isNil(evalId) && (!enableGetNext) && isAssigned) {
      onAutoSave('Paused');
    }
    onClearStagerTaskName();
    onEndShift(EndShift.CLEAR_DASHBOARD_DATA);
    if (path === '/stager') {
      onClearStagerResponse();
    }
  }

  render() {
    const { path, user, hiddenRoutes } = this.props;
    const groupList = user && user.groupList;
    return (
      <div styleName="stretch-column">
        <nav id="cmod_leftnav" styleName="left-nav-bar">
          {
            links.map(link => (
              shouldShowIcon(link, groupList, hiddenRoutes)
                ? (
                  <Link
                    key={link.name}
                    className={this.constructor.getIconStyle(path, link.path)}
                    onClick={() => this.handleLandingpage(link.path)}
                    to={link.path}
                  >
                    <img alt={link.name} src={link.img} />
                  </Link>
                ) : null
            ))
          }
        </nav>
      </div>
    );
  }
}
LeftNav.defaultProps = {
  enableGetNext: false,
  evalId: '',
  hiddenRoutes: [],
};

LeftNav.propTypes = {
  enableGetNext: PropTypes.bool,
  evalId: PropTypes.string,
  hiddenRoutes: PropTypes.arrayOf(PropTypes.string),
  isAssigned: PropTypes.bool.isRequired,
  onAutoSave: PropTypes.func.isRequired,
  onClearStagerResponse: PropTypes.func.isRequired,
  onClearStagerTaskName: PropTypes.func.isRequired,
  onEndShift: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  user: PropTypes.shape({
    groupList: PropTypes.array,
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
  hiddenRoutes: configSelectors.hiddenRoutes(state),
});

const mapDispatchToProps = dispatch => ({
  onAutoSave: operations.onAutoSave(dispatch),
  onEndShift: operations.onEndShift(dispatch),
  onClearStagerTaskName: operations.onClearStagerTaskName(dispatch),
  onClearStagerResponse: stagerOperations.onClearStagerResponse(dispatch),

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
