import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import DocChecklist from '../IncomeCalc/DocChecklist/DocChecklist';
import Loader from '../Loader/Loader';
import './DocChecklistWidget.css';

class DocChecklistWidget extends React.PureComponent {
  render() {
    const {
      inProgress,
    } = this.props;

    if (inProgress) {
      return (
        <div styleName="income-loader">
          <Loader message="Please Wait" />
        </div>
      );
    }

    return (
      <div>
        <Grid container style={{ position: 'absolute', background: 'white' }}>
          <Grid item style={{ display: 'flex' }} xs={12}>
            <span styleName="header"> Document Checklist </span>
          </Grid>
        </Grid>
        <div style={{ marginTop: '3.5rem', marginLeft: '1.5rem' }}>
          <DocChecklist />
        </div>
      </div>
    );
  }
}


DocChecklistWidget.propTypes = {
  failureReason: PropTypes.shape({
    1: PropTypes.number,
    2: PropTypes.number,
  }),
  inProgress: PropTypes.bool.isRequired,

  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string.isRequired,
  }).isRequired,
};


DocChecklistWidget.defaultProps = {
  failureReason: {},
};

export default connect(null, null)(DocChecklistWidget);
