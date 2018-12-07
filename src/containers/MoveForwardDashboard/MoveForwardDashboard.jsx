import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';

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
    const pidsList = pids.split(',');
    const requestURL = 'https://mrcooperdev.azure-api.net/enterprise/wq/activate/api/process/release';
    const requestBody = {
      pids: pidsList,
    };
    const headers = {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'a5e8c5b61283443793321b3aac39a877',
    };

    axios.post(requestURL, requestBody, { headers })
      .then((res) => {
        console.log(res);
      });
  }

  render() {
    const { pids } = this.state;
    return (
      <>
        <Grid container>
          <Grid item lg={3} xs={3}>
            <Grid xs={12}>
              <TextField
                id="pids"
                label="Enter PIDs"
                margin="normal"
                multiline
                onChange={this.handleChange}
                rows="4"
                style={{ width: '100%' }}
                value={pids}
              />
            </Grid>
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
