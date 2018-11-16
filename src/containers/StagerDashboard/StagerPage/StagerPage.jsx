import React from 'react';
import ContentHeader from 'components/ContentHeader';
import Grid from '@material-ui/core/Grid';
import Controls from 'containers/Controls';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
// import FullHeightColumn from 'components/FullHeightColumn';
import StagerTiles from '../StagerTiles';
// import StagerDetailsTable from '../StagerDetailsTable';
import './StagerPage.css';

class EvaluationPage extends React.PureComponent {
  render() {
    return (
      <>
        <ContentHeader title={(
          <Select
            value="UNDERWRITER"
          >
            <MenuItem value="UNDERWRITER">UNDERWRITER STAGER</MenuItem>
          </Select>
        )}
        >
          <Controls />
        </ContentHeader>
        <Grid contianer>
          <Grid item xs={6}>
            <StagerTiles />
          </Grid>
          {/* <Grid item xs={6}>
            <StagerDetailsTable />
          </Grid> */}
        </Grid>
      </>
    );
  }
}

export default EvaluationPage;
