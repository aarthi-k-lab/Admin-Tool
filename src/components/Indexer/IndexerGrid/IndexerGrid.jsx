import React from 'react';
import { Typography } from '@material-ui/core/index';
import PropTypes from 'prop-types';
import Loader from 'components/Loader';
import SweetAlertBox from 'components/SweetAlertBox';
import {
  INDEXER_TABLE_COLUMNS,
} from 'constants/indexer';
import MUITable from '../Table/MUITable';
import './IndexerGrid.css';

const IndexerGrid = (props) => {
  const {
    handleLink, data, handleChange, inProgress, resultOperation, closeAlert,
  } = props;

  return (
    <>
      { inProgress
        ? <Loader size={20} />

        : (
          <div styleName="indexer-container">
            <Typography variant="h2">INDEXER</Typography>
            <MUITable columns={INDEXER_TABLE_COLUMNS} handleChange={handleChange} handleLink={handleLink} indexerData={data} size="small" />
            {resultOperation && resultOperation.status && (
            <SweetAlertBox
              message={resultOperation.status}
              onConfirm={() => {
                closeAlert();
              }}
              show={resultOperation.isOpen}
              type={resultOperation.level}
            />
            )}
          </div>
        )
    }
    </>
  );
};

IndexerGrid.propTypes = {
  closeAlert: PropTypes.func.isRequired,
  data: PropTypes.shape().isRequired,
  handleChange: PropTypes.func.isRequired,
  handleLink: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  resultOperation: PropTypes.shape({
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};

export default IndexerGrid;
