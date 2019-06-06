import React from 'react';
import moment from 'moment-timezone';
import Loader from 'components/Loader/Loader';
import './TrialLetter.css';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { selectors } from '../../../state/ducks/dashboard';

const TrialLetterHeader = () => (
  <Grid container style={{ display: 'flex' }} styleName="widgetHeaderAndContent">
    <Grid item xs={2}>
      <span styleName="header-style">Case Id</span>
    </Grid>
    <Grid item xs={4}>
      <span styleName="header-style">Case Type</span>
    </Grid>
    <Grid item xs={3}>
      <span style={{ textAlign: 'center' }} styleName="header-style">Case Status</span>
    </Grid>
    <Grid item xs={3}>
      <span styleName="header-style">Trial Letter Sent On</span>
    </Grid>
  </Grid>
);

const TrialLetterDetails = props => (
  props.trialsLetter && props.trialsLetter.map(doc => (
    <Grid key={doc.resolutionId} container styleName="widgetHeaderAndContent">
      <Grid item xs={2}>
        <span styleName="tableData-style">{doc.resolutionId}</span>
      </Grid>
      <Grid item xs={4}>
        <span styleName="tableData-style">{doc.resolutionChoiceType}</span>
      </Grid>
      <Grid item xs={3}>
        <span styleName="tableData-style">{doc.resolutionStatus}</span>
      </Grid>
      <Grid item xs={3}>
        <span styleName="tableData-style">{moment(doc.trialLetterSentDate).format('MM/DD/YYYY')}</span>
      </Grid>
    </Grid>
  ))
);

class TrialLetter extends React.Component {
  render() {
    const { trialsLetter } = this.props;
    const { inProgress } = this.props;
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
    }
    return (
      <>
        <div styleName="title-style">
          Customer Communication Letter
        </div>
        <TrialLetterHeader />
        <TrialLetterDetails trialsLetter={trialsLetter} />
      </>
    );
  }
}

TrialLetter.defaultProps = {
  inProgress: false,
  trialsLetter: [],
};
TrialLetter.propTypes = {
  inProgress: PropTypes.bool,
  trialsLetter: PropTypes.arrayOf(
    PropTypes.shape({
      evalId: PropTypes.number,
      evalStatus: PropTypes.string,
      evalSubStatus: PropTypes.string,
      letterFlag: PropTypes.string,
      loanId: PropTypes.number,
      resolutionChoiceType: PropTypes.string,
      resolutionId: PropTypes.number,
      resolutionStatus: PropTypes.string,
      resolutionSubStatus: PropTypes.string,
      trialLetterSentDate: PropTypes.string,
    }),
  ),
};

const mapStateToProps = state => ({
  inProgress: selectors.inProgress(state),
  trialsLetter: selectors.getTrialLetter(state),
});

const TrialLetterContainer = connect(mapStateToProps, null)(TrialLetter);

export default TrialLetterContainer;
