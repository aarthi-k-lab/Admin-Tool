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
import UserNotification from 'components/UserNotification';
import ErrorIcon from '@material-ui/icons/Error';
import GetAppIcon from '@material-ui/icons/GetApp';
import { selectors, operations } from 'ducks/dashboard';
import { PropTypes } from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
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
const events = [
  { category: 'Fulfillment Request', label: 'Get Data', value: 1 },
  { category: 'X Request', label: 'Post Data', value: 2 },
  { category: 'Y Request', label: 'Get Data', value: 3 },
  { category: 'X Request', label: 'Print Data', value: 4 },
  { category: 'Fulfillment Request', label: 'Send Data', value: 5 },
];

const getEventCategories = [
  { label: 'Fulfillment Request', value: 1 },
  { label: 'X Request', value: 2 },
  { label: 'Y Request', value: 3 },
];

const getEventNames = category => R.filter(item => item.category === category, events);

class CoviusBulkOrder extends React.PureComponent {
  constructor(props) {
    super(props);
    this.csvLink = React.createRef();
    this.state = {
      caseIds: '',
      isSubmitDisabled: 'disabled',
      selectedEventName: '',
      selectedEventCategory: '',
      eventNames: [],
      isResetDisabled: 'disabled',
    };

    this.renderNotepadArea = this.renderNotepadArea.bind(this);
  }

  onResetClick = () => {
    this.setState({
      selectedEventCategory: '',
      selectedEventName: '',
      caseIds: '',
      isSubmitDisabled: 'disabled',
      isResetDisabled: 'disabled',
      eventNames: [],
    });
  }

  onSubmitCases = () => {
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
      isResetDisabled: event.target.value.trim() || !R.isEmpty(selectedEventName) || !R.isEmpty(selectedEventCategory) ? '' : 'disabled',
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
    const eventCategory = event.target.value;
    const eventNames = getEventNames(eventCategory);
    this.setState({
      selectedEventCategory: eventCategory,
      isSubmitDisabled: 'disabled',
      selectedEventName: '',
      eventNames,
      isResetDisabled: '',
    });
  }

  renderCategoryDropDown = () => {
    const { selectedEventCategory } = this.state;
    return (
      <FormControl variant="outlined">
        <Select
          input={<OutlinedInput name="eventCategory" />}
          label="category"
          onChange={this.handleEventCategory}
          styleName="drop-down-select"
          value={selectedEventCategory.eventCategory}
        >
          {getEventCategories.map(item => (
            <MenuItem key={item} value={item.label}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  renderNamesDropDown(eventNames) {
    const { selectedEventName } = this.state;
    return (

      <FormControl variant="outlined">
        <Select
          input={<OutlinedInput name="eventName" />}
          onChange={event => this.handleEventName(event)}
          styleName="drop-down-select"
          value={selectedEventName.eventName}
        >
          {eventNames.map(item => <MenuItem value={item.value}>{item.label}</MenuItem>)}

        </Select>
      </FormControl>
    );
  }

  renderNotepadArea() {
    const {
      caseIds, isSubmitDisabled, eventNames, isResetDisabled,
    } = this.state;
    return (
      <div styleName="status-details-parent">
        <span styleName="newBulkUpload">
          {'New Event Request'}
        </span>
        <span styleName="resetButton">
          <Button
            className="material-ui-button"
            color="primary"
            disabled={isResetDisabled}
            onClick={() => this.onResetClick()}
            styleName="reset-button-style"
            variant="contained"
          >
            RESET
          </Button>
        </span>
        <div styleName="loan-numbers">
          <span>
            {'Event Category'}
          </span>
          <span styleName="errorIcon">
            <ErrorIcon styleName="errorSvg" />
          </span>
        </div>
        {this.renderCategoryDropDown()}
        <div styleName="loan-numbers">
          <span>
            {'Event Name'}
          </span>
          <span styleName="errorIcon">
            <ErrorIcon styleName="errorSvg" />
          </span>
        </div>
        {this.renderNamesDropDown(eventNames)}
        <span styleName="loan-numbers">
          {'Case id(s)'}
        </span>
        <div styleName="status-details">
          <TextField
            id="caseIds"
            margin="normal"
            multiline
            onChange={event => this.handleCaseChange(event)}
            rows={30}
            style={{ width: '99%', resize: 'none' }}
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
              onClick={() => this.onSubmitCases()}
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
    return (
      <Grid item xs={12}>
        <TabView tableData={resultData} />
        <div styleName="errorSvginfo">
          <ErrorIcon styleName="errorSvg" />
          <Button
            className="material-ui-button"
            color="primary"
            margin="normal"
            startIcon={<GetAppIcon />
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

  render() {
    const { inProgress, resultOperation } = this.props;
    const title = '';

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
              <div styleName="title-row">
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
          <Grid item xs={2}>
            {this.renderNotepadArea()}
          </Grid>
          <Grid item xs={10}>
            {
              inProgress
                ? <Loader message="Loading" />
                : this.renderResults()
            }
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
  resultData: {
    DocumentRequests: [],
    invalidCases: [],
  },
  resultOperation: { level: '', status: '' },
};

CoviusBulkOrder.propTypes = {
  inProgress: PropTypes.bool,
  onCoviusBulkSubmit: PropTypes.func,
  onFailedLoanValidation: PropTypes.func,
  resultData: PropTypes.shape({
    DocumentRequests: PropTypes.arrayOf({
      UserDetails: PropTypes.shape({
        CASEID: PropTypes.string,
        EVAL_ID: PropTypes.string,
        LOAN_NUMBER: PropTypes.string,
      }),
      RequestId: PropTypes.string,
    }),
    invalidCases: PropTypes.arrayOf({
      caseId: PropTypes.string,
      message: PropTypes.string,
    }),
  }),
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
