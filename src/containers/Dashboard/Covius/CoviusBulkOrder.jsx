import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import ContentHeader from 'components/ContentHeader';
import Controls from 'containers/Controls';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './CoviusBulkOrder.css';
import * as R from 'ramda';
import Select from '@material-ui/core/Select';
import Loader from 'components/Loader/Loader';
import MenuItem from '@material-ui/core/MenuItem';
import UserNotification from 'components/UserNotification';
import ErrorIcon from '@material-ui/icons/Error';
import { selectors, operations } from 'ducks/dashboard';
import { PropTypes } from 'prop-types';
import TabView from './TabView';


const validCaseEntries = RegExp(/[a-zA-Z]|[~`(@!#$%^&*+._)=\-[\]\\';/{}|\\":<>?]/);
const validateCaseFormat = (caseIds) => {
  let isValid = true;
  // eslint-disable-next-line
  if (validCaseEntries.test(caseIds)) {
    isValid = false;
  }
  return isValid;
};

class CoviusBulkOrder extends React.PureComponent {
  constructor(props) {
    super(props);
    this.csvLink = React.createRef();
    this.state = {
      caseIds: '',
      isSubmitDisabled: 'disabled',
      selectedEventName: '',
      selectedEventCategory: '',
    };

    this.renderNotepadArea = this.renderNotepadArea.bind(this);
  }

  OnSubmitCases = () => {
    const { caseIds } = this.state;
    const { onCoviusBulkSubmit, onFailedLoanValidation } = this.props;
    if (validateCaseFormat(caseIds)) {
      this.setState({ isSubmitDisabled: 'disabled' });
      const cases = caseIds.trim().replace(/\n/g, ',').split(',').map(s => s.trim());
      const caseIdsList = new Set(cases);
      const payload = {
        caseIds: [...caseIdsList],
      };
      onCoviusBulkSubmit(payload);
    } else {
      const payload = {
        level: 'error',
        status: 'Please enter case id(s) in correct format. Only comma and newline separated case numbers are accepted.',
      };
      onFailedLoanValidation(payload);
    }
  }

  handleCaseChange = (event) => {
    const { selectedEventName, selectedEventCategory } = this.state;
    this.setState({
      caseIds: event.target.value,
      isSubmitDisabled: event.target.value.trim() && !R.isEmpty(selectedEventName) && !R.isEmpty(selectedEventCategory) ? '' : 'disabled',
    });
  }

  handleEventName = (event) => {
    const { caseIds, selectedEventCategory } = this.state;
    const eventName = event.target.value;
    let disableSubmit = '';
    disableSubmit = !R.isEmpty(eventName) && !R.isEmpty(selectedEventCategory) && !R.isEmpty(caseIds) ? '' : 'disabled';
    this.setState({ selectedEventName: eventName, isSubmitDisabled: disableSubmit });
  }

  handleEventCategory = (event) => {
    const { caseIds, selectedEventName } = this.state;
    const eventCategory = event.target.value;
    let disableSubmit = '';
    disableSubmit = !R.isEmpty(eventCategory) && !R.isEmpty(selectedEventName) && !R.isEmpty(caseIds) ? '' : 'disabled';
    this.setState({ selectedEventCategory: eventCategory, isSubmitDisabled: disableSubmit });
  }

  renderNotepadArea() {
    const {
      caseIds, isSubmitDisabled, selectedEventName, selectedEventCategory,
    } = this.state;
    const techCompanies = [
      { label: 'Apple', value: 1 },
      { label: 'Facebook', value: 2 },
      { label: 'Netflix', value: 3 },
      { label: 'Tesla', value: 4 },
      { label: 'Amazon', value: 5 },
      { label: 'Alphabet', value: 6 },
    ];
    return (
      <div styleName="status-details-parent">
        <span styleName="newBulkUpload">
          {'New Event Request'}
        </span>
        <div styleName="loan-numbers">
          <span>
            {'Event Category'}
          </span>
          <span styleName="errorIcon">
            <ErrorIcon styleName="errorSvg" />
          </span>
        </div>
        <div style={{
          margin: '0rem 0.5rem 2rem 0.5rem',
        }}
        >
          <Select
            onChange={this.handleEventCategory}
            styleName="drop-down-select"
            value={selectedEventCategory}
          >
            {techCompanies.map(item => (
              <MenuItem key={item} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>

        </div>
        <div styleName="loan-numbers">
          <span>
            {'Event Name'}
          </span>
          <span styleName="errorIcon">
            <ErrorIcon styleName="errorSvg" />
          </span>
        </div>
        <div style={{
          margin: '0rem 0.5rem 2rem 0.5rem',
        }}
        >
          <Select
            onChange={event => this.handleEventName(event)}
            styleName="drop-down-select"
            value={selectedEventName}
          >
            {techCompanies.map(item => <MenuItem value={item.value}>{item.label}</MenuItem>)}
          </Select>

        </div>
        <span styleName="loan-numbers">
          {'Case id(s)'}
        </span>
        <div styleName="status-details">
          <TextField
            id="caseIds"
            margin="normal"
            multiline
            onChange={event => this.handleCaseChange(event)}
            style={{ height: '98%', width: '99%', resize: 'none' }}
            value={caseIds}
          />
        </div>
        <div styleName="interactive-button">
          <div>
            <Button
              className="material-ui-button"
              color="primary"
              disabled={isSubmitDisabled}
              margin="normal"
              onClick={() => this.OnSubmitCases()}
              styleName="submitButton"
              variant="contained"
            >
              SUBMIT
            </Button>
          </div>
        </div>
      </div>
    );
  }


  renderResults() {
    const { resultData } = this.props;
    if (resultData && !R.isEmpty(resultData)) {
      return (
        <Grid item xs={12}>
          <TabView tableData={resultData} />
          <div styleName="infoMessage">
            <ErrorIcon styleName="errorSvg" />
            <Button
              className="material-ui-button"
              color="primary"
              margin="normal"
              startIcon={<ErrorIcon styleName="errorSvg" />
              }
              styleName="submitButton"
              variant="contained"
            >
              DOWNLOAD EXCEL TO VERIFY
            </Button>
          </div>
        </Grid>
      );
    }

    return (
      <Grid item xs={6}>
        <div styleName="infoMessage">
          Processed loan information will be displayed here
        </div>
      </Grid>
    );
  }

  render() {
    const { inProgress, resultOperation } = this.props;
    const title = '';
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
    }
    return (
      <>
        <ContentHeader title={title}>
          <Grid container style={{ height: '3rem' }} xs={12}>
            <Grid item xs={1}>
              <div styleName="coviusLabel">
                Covius
              </div>
            </Grid>
            <Grid item xs={4}>
              <div styleName="error-message">
                {(resultOperation && resultOperation.status)
                  ? <UserNotification level={resultOperation.level} message={resultOperation.status} type="alert-box" />
                  : ''
                }
              </div>
            </Grid>
          </Grid>
          <Controls />
        </ContentHeader>
        <Grid container styleName="loan-activity" xs={12}>
          <Grid item xs={2}>{this.renderNotepadArea()}</Grid>
          <Grid item xs={10}>
            {this.renderResults()}
          </Grid>
        </Grid>
      </>
    );
  }
}

CoviusBulkOrder.defaultProps = {
  inProgress: false,
  onCoviusBulkSubmit: () => { },
  onFailedLoanValidation: () => { },
  resultData: [],
  resultOperation: { level: '', status: '' },
};

CoviusBulkOrder.propTypes = {
  inProgress: PropTypes.bool,
  onCoviusBulkSubmit: PropTypes.func,
  onFailedLoanValidation: PropTypes.func,
  resultData: PropTypes.arrayOf(
    PropTypes.shape({
      evalId: PropTypes.string,
      pid: PropTypes.string,
      statusMessage: PropTypes.string,
    }),
  ),
  resultOperation: PropTypes.shape({
    level: PropTypes.string,
    status: PropTypes.string,
  }),
};

const mapStateToProps = state => ({
  inProgress: selectors.inProgress(state),
  resultData: selectors.resultData(state),
  resultOperation: selectors.resultOperation(state),
});

const mapDispatchToProps = dispatch => ({
  onCoviusBulkSubmit: operations.onCoviusCasesSubmit(dispatch),
  onFailedLoanValidation: operations.onFailedLoanValidation(dispatch),
});

const CoviusBulkOrderContainer = connect(mapStateToProps, mapDispatchToProps)(CoviusBulkOrder);


export default withRouter(CoviusBulkOrderContainer);
