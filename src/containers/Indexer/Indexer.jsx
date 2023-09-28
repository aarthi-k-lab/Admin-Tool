import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Indexer.css';
import { operations as indexerOperations, selectors as indexerSelectors } from 'ducks/indexer';
import { operations as dashboardOperations, selectors as dashboardSelectors } from 'ducks/dashboard';
import IndexerGrid from '../../components/Indexer/IndexerGrid';
import Indexing from '../../components/Indexer/Indexing';


const Indexer = ({
  fetchTombstoneData, onGetGroupName, group, indexerGridData, fetchIndexerGridData, inProgress,
  resultOperation,
  resetResultOperationOperation,
}) => {
  const [isIndexerVisible, setIsIndexerVisible] = useState(true);

  useEffect(() => {
    onGetGroupName(group);
    fetchIndexerGridData(0, 5);
  }, []);

  const handleLink = (val) => {
    fetchTombstoneData(val.loanId);
    setIsIndexerVisible(false);
  };
  return (
    <>
      {isIndexerVisible ? (
        <IndexerGrid
          closeAlert={resetResultOperationOperation}
          data={indexerGridData}
          handleChange={(page, rowPage) => fetchIndexerGridData(page, rowPage)}
          handleLink={handleLink}
          inProgress={inProgress}
          resultOperation={resultOperation}
        />
      ) : (
        <>
          <Indexing handleLink={() => { setIsIndexerVisible(true); }} />
        </>
      )}

    </>
  );
};

Indexer.defaultProps = {
  group: '',
  indexerGridData: {},
  fetchIndexerGridData: () => {},
  inProgress: true,
};

Indexer.propTypes = {
  fetchIndexerGridData: PropTypes.func,
  fetchTombstoneData: PropTypes.func.isRequired,
  group: PropTypes.string,
  indexerGridData: PropTypes.shape(),
  inProgress: PropTypes.bool,
  onGetGroupName: PropTypes.func.isRequired,
  resetResultOperationOperation: PropTypes.func.isRequired,
  resultOperation: PropTypes.shape({
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  indexerGridData: indexerSelectors.getIndexerGridData(state),
  inProgress: dashboardSelectors.inProgress(state),
  resultOperation: dashboardSelectors.resultOperation(state),
});

const mapDispatchToProps = dispatch => ({
  fetchTombstoneData: indexerOperations.fetchTombstoneData(dispatch),
  onGetGroupName: dashboardOperations.onGetGroupName(dispatch),
  fetchIndexerGridData: indexerOperations.fetchIndexerGridData(dispatch),
  resetResultOperationOperation: dashboardOperations.resetResultOperationOperation(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(Indexer);
