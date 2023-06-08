import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import DocChecklist from '../IncomeCalc/DocChecklist/DocChecklist';
import Loader from '../Loader/Loader';
import './DocChecklistWidget.css';
import { operations as documentChecklistOperations } from '../../state/ducks/document-checklist';


class DocChecklistWidget extends React.PureComponent {
  componentDidMount() {
    const { setRadioSelect } = this.props;
    setRadioSelect('');
  }

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
  setRadioSelect: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  setRadioSelect: documentChecklistOperations.radioSelectOperation(dispatch),
});


DocChecklistWidget.defaultProps = {
  failureReason: {},
};

export default connect(null, mapDispatchToProps)(DocChecklistWidget);
