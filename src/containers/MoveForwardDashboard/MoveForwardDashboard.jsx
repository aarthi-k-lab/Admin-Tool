import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';

class MoveForwardDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pids: '', pidsStatus: {}, pidsCount: 0 };

    this.handleChange = this.handleChange.bind(this);
    this.moveForward = this.moveForward.bind(this);
  }

  handleChange(event) {
    this.setState({ pids: event.target.value });
  }

  moveForward() {
    const { pids } = this.state;
    const pidsStatus = {};
    const pidsList = pids.split(',');
    const pidsCount = pidsList.length;
    this.setState({ pidsCount });
    const requestURL = 'https://mrcooperdev.azure-api.net/enterprise/wq/activate/api/process/release';
    const requestBody = {
      pids: pidsList,
    };
    const headers = {
      'Content-Type': 'application/json',
    };

    axios.post(requestURL, requestBody, { headers })
      .then((res) => {
        console.log(res);
        Object.keys(res).forEach((key) => {
          pidsStatus[key] = res[key].updateInstanceStatusResponse.statusCode;
        });
        this.setState({ pidsStatus });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { pids } = this.state;
    const { pidsStatus } = this.state;
    const { pidsCount } = this.state;
    return (
      <>
        <Grid container>
          <Grid lg={3} xs={3}>
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
              margin="normal"
              onClick={this.moveForward}
              variant="contained"
            >
              Move Forward
            </Button>
          </Grid>
          <Grid item lg={9} xs={9}>
            <p>
              {pidsCount}
              &nbsp; pids have been moved forward.
            </p>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>PIDs</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { Object.keys(pidsStatus).map(keyName => (
                  <TableRow>
                    <TableCell>{ keyName }</TableCell>
                    <TableCell>{ pidsStatus[keyName] }</TableCell>
                  </TableRow>
                ))
                }
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default MoveForwardDashboard;
