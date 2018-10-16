import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { EndShift, Expand, GetNext } from 'components/ContentHeader';
import {
  operations,
  selectors,
} from 'ducks/dashboard';

class Controls extends React.PureComponent {
  render() {
    const {
      enableGetNext,
      onEndShift,
      onExpand,
      onGetNext,
      showEndShift,
      showGetNext,
    } = this.props;
    const getNext = showGetNext ? <GetNext disabled={!enableGetNext} onClick={onGetNext} /> : null;
    const endShift = showEndShift ? <EndShift onClick={onEndShift} /> : null;
    const expand = <Expand onClick={onExpand} />;
    return (
      <>
        {endShift}
        {getNext}
        {expand}
      </>
    );
  }
}

Controls.defaultProps = {
  enableGetNext: false,
  onEndShift: () => {},
  onExpand: () => {},
  onGetNext: () => {},
  showEndShift: false,
  showGetNext: false,
};

Controls.propTypes = {
  enableGetNext: PropTypes.bool,
  onEndShift: PropTypes.func,
  onExpand: PropTypes.func,
  onGetNext: PropTypes.func,
  showEndShift: PropTypes.bool,
  showGetNext: PropTypes.bool,
};

const mapStateToProps = state => ({
  enableGetNext: selectors.enableGetNext(state),
});

const mapDispatchToProps = dispatch => ({
  onExpand: operations.onExpand(dispatch),
  onGetNext: operations.onGetNext(dispatch),
});

const ControlsContainer = connect(mapStateToProps, mapDispatchToProps)(Controls);

const TestHooks = {
  Controls,
};

export default ControlsContainer;
export { TestHooks };