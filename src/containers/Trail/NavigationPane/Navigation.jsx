import React from 'react';
import Grid from '@material-ui/core/Grid';
import './Navigation.css';

class Navigation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={3}>
            <div>
              START DATE
            </div>
          </Grid>
          <Grid item xs={3}>
            <div>
              END DATE
            </div>
          </Grid>
          <Grid item xs={6}>
            <div>
              EXPECTED COMPLETION DATE
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Navigation.propTypes = {
};

export default Navigation;
