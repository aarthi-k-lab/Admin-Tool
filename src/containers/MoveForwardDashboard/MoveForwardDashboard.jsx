import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
              multiline
              onChange={this.handleChange}
              rows="8"
              value={pids}
            />

            <Button
              className="material-ui-button"
              color="primary"
              onClick={this.moveForward}
              variant="contained"
            >
              Move Forward
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default MoveForwardDashboard;
