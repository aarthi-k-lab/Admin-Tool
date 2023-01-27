import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tombstone, { TombstoneError, TombstoneLoader } from 'components/Tombstone';
import { selectors } from 'ducks/tombstone';
import { selectors as dashboardSelector } from 'ducks/dashboard';

class TombstoneWrapper extends React.PureComponent {
  render() {
    const {
      loading, error, data, group, disableIcons,
    } = this.props;
    if (loading) {
      return <TombstoneLoader />;
    }
    if (error) {
      return <TombstoneError />;
    }
    return <Tombstone disableIcons={disableIcons} group={group} items={data} />;
  }
}

TombstoneWrapper.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.any.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  disableIcons: PropTypes.bool,
  error: PropTypes.bool.isRequired,
  group: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

TombstoneWrapper.defaultProps = {
  disableIcons: false,
};

const mapStateToProps = state => ({
  data: selectors.getTombstoneData(state),
  error: selectors.hasError(state),
  group: dashboardSelector.groupName(state),
  loading: selectors.isLoading(state),
});

const TombstoneContainer = connect(mapStateToProps)(TombstoneWrapper);

const TestHooks = {
  TombstoneWrapper,
};

export default TombstoneContainer;
export { TestHooks };
