import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { operations, selectors } from '../state/ducks/dashboard';


class HandleBrowserEvent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.confirmNavigation = this.confirmNavigation.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.confirmNavigation);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.confirmNavigation);
  }

  confirmNavigation(event) {
    const {
      onAutoSave, onEndShift, enableGetNext, evalId, isAssigned,
    } = this.props;
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.returnValue = '';
    if (!R.isEmpty(evalId) && !R.isNil(evalId) && (!enableGetNext) && isAssigned) {
      onAutoSave('Paused');
    }
    setTimeout(() => onEndShift(), 0);
  }

  render() {
    return null;
  }
}
HandleBrowserEvent.defaultProps = {
  enableGetNext: false,
};
HandleBrowserEvent.propTypes = {
  enableGetNext: PropTypes.bool,
  evalId: PropTypes.string.isRequired,
  isAssigned: PropTypes.bool.isRequired,
  onAutoSave: PropTypes.func.isRequired,
  onEndShift: PropTypes.func.isRequired,
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

const HandleBrowserEventContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HandleBrowserEvent);

export default HandleBrowserEventContainer;
