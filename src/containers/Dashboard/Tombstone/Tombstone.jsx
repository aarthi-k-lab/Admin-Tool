import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tombstone, { TombstoneError, TombstoneLoader } from 'components/Tombstone';
import { selectors } from 'ducks/tombstone';

class TombstoneWrapper extends React.PureComponent {
  render() {
    const { loading, error, data } = this.props;
    if (loading) {
      return <TombstoneLoader />;
    }
    if (error) {
      return <TombstoneError />;
    }
    return <Tombstone items={data} />;
  }
}

TombstoneWrapper.propTypes = {
  data: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  data: selectors.getTombstoneData(state),
  error: selectors.hasError(state),
  loading: selectors.isLoading(state),
});

const TombstoneContainer = connect(mapStateToProps)(TombstoneWrapper);

const TestHooks = {
  TombstoneWrapper,
};

export default TombstoneContainer;
export { TestHooks };
