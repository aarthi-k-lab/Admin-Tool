import React from 'react';
import ContentHeader from 'components/ContentHeader';
import Grid from '@material-ui/core/Grid';
import Controls from 'containers/Controls';
// import FullHeightColumn from 'components/FullHeightColumn';
import StagerTiles from '../StagerTiles';
// import StagerDetailsTable from '../StagerDetailsTable';
import './StagerPage.css';

class EvaluationPage extends React.PureComponent {
  render() {
    return (
      <>
        <ContentHeader title="Stager Dashboard">
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
