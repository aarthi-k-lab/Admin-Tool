import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

class MoveForwardDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pids: '' };

    this.handleChange = this.handleChange.bind(this);
    this.moveForward = this.moveForward.bind(this);
  }

  handleChange(event) {
    this.setState({ pids: event.target.value });
  }

  moveForward() {
    const { pids } = this.state;
    console.log(pids);
  }

  render() {
    const { pids } = this.state;
    return (
      <>
        <Grid container>
          <Grid item lg={2} xs={2}>
            <TextField
              id="pids"
              label="Enter PIDs"
              margin="normal"
              onChange={this.handleChange}
              value={pids}
            />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default MoveForwardDashboard;
