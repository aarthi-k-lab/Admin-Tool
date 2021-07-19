import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid/Grid';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';

import './Filters.css';

class Filters extends React.PureComponent {
  render() {
    const { loading } = this.props;
    const { onChange, onClick, pids } = this.props;

    return (
      <>
        <Grid container direction="row" justify="center">
          <Grid alignItems="center" container direction="column" item>
            <Grid item>
              <TextField
                id="pids"
                label="Enter PIDs"
                margin="normal"
                multiline
                onChange={onChange}
                rows="4"
                styleName="pid-textbox"
                value={pids}
              />
            </Grid>
            <Grid item>
              <div styleName="interactive-button">
                <Button
                  className="material-ui-button"
                  color="primary"
                  disabled={loading}
                  margin="normal"
                  onClick={onClick}
                  variant="contained"
                >
                  Move Forward
                </Button>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}

Filters.defaultProps = {
  loading: false,
};

Filters.propTypes = {
  loading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  pids: PropTypes.string.isRequired,
};

export default Filters;
