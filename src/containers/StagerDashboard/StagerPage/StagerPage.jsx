import React from 'react';
import ContentHeader from 'components/ContentHeader';
import Grid from '@material-ui/core/Grid';
import Controls from 'containers/Controls';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
// import FullHeightColumn from 'components/FullHeightColumn';
import StagerTiles from '../StagerTiles';
import StagerDetailsTable from '../StagerDetailsTable';
import './StagerPage.css';

class EvaluationPage extends React.PureComponent {
  render() {
    const { counts, onStatusCardClick } = this.props;
    return (
      <>
        <ContentHeader title={(
          <Select
            disabled
            value="UNDERWRITER"
          >
            <MenuItem value="UNDERWRITER">UNDERWRITER STAGER</MenuItem>
          </Select>
        )}
        >
          <Controls />
        </ContentHeader>
        <Grid contianer>
          <Grid item xs={4}>
            <StagerTiles counts={counts} onStatusCardClick={onStatusCardClick} />
          </Grid>
          <Grid item xs={8}>
            <StagerDetailsTable />
          </Grid>
        </Grid>
      </>
    );
  }
}

EvaluationPage.propTypes = {
  counts: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          aboutToBreach: PropTypes.number,
          displayName: PropTypes.string,
          searchTerm: PropTypes.string,
          slaBreached: PropTypes.number,
          total: PropTypes.number,
        }),
      ),
      displayName: PropTypes.string,
    }),
  ).isRequired,
  onStatusCardClick: PropTypes.func.isRequired,
};

export default EvaluationPage;
