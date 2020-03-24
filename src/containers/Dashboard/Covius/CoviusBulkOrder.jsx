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
import SweetAlertBox from 'components/SweetAlertBox';
import ErrorIcon from '@material-ui/icons/Error';
import GetAppIcon from '@material-ui/icons/GetApp';
import { selectors, operations } from 'ducks/dashboard';
import { PropTypes } from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import * as XLSX from 'xlsx';
import TabView from './TabView';

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
      isVisible: true,
      isOpen: true,
      tabIndex: 0,
    };

    this.renderNotepadArea = this.renderNotepadArea.bind(this);
  }

  onResetClick = () => {
    this.setState({
      selectedEventCategory: ' ',
      selectedEventName: '',
      caseIds: '',
      isSubmitDisabled: 'disabled',
      isResetDisabled: 'disabled',
      eventNames: [],
    });
  }

  onSubmitCases = () => {
    const { caseIds } = this.state;
    const { onCoviusBulkSubmit } = this.props;
    this.setState({ isSubmitDisabled: 'disabled' });
    const cases = caseIds.trim().replace(/\n/g, ',').split(',').map(s => s.trim());
    const caseIdsList = new Set(cases);
    const payload = {
      caseIds: R.filter(caseId => !R.isEmpty(caseId), [...caseIdsList]),
    };
    onCoviusBulkSubmit(payload);
  }

  handleCaseChange = (event) => {
    const { selectedEventName, selectedEventCategory } = this.state;
    const re = /[a-zA-Z]|[~`(@!#$%^&*+._)=\-[\]\\';/{}|\\":<>?]/;
    if (event.target.value === '' || !re.test(event.target.value)) {
      this.setState({
        caseIds: event.target.value,
        isSubmitDisabled: event.target.value.trim() && !R.isEmpty(selectedEventName) && !R.isEmpty(selectedEventCategory) ? '' : 'disabled',
        isResetDisabled: event.target.value.trim() || !R.isEmpty(selectedEventName) || !R.isEmpty(selectedEventCategory) ? '' : 'disabled',
      });
    }
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

  handleClose = () => {
    this.setState({ isOpen: false });
  }

  renderCategoryDropDown = () => {
    const { selectedEventCategory } = this.state;
    return (
      <FormControl variant="outlined">
        <Select
          input={<OutlinedInput name="selectedEventCategory" />}
          label="category"
          onChange={this.handleEventCategory}
          styleName="drop-down-select"
          value={selectedEventCategory}
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

  handleTabChange = (value, tabIndex) => {
    this.setState({ isVisible: value, tabIndex });
  }

  jsonToExcelDownload = (fileName, data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, fileName);
    XLSX.writeFile(wb, fileName);
  }

  handleDownload = () => {
    const { tabIndex } = this.state;
    const { coviusSubmitData } = this.props;
    if (tabIndex === 0) {
      const failedData = coviusSubmitData.failed;
      this.jsonToExcelDownload('failed.xlsx', failedData);
    } else if (tabIndex === 1) {
      const passedData = coviusSubmitData.passed;
      this.jsonToExcelDownload('passed.xlsx', passedData);
    }
  }

  renderNotepadArea() {
    const {
      caseIds, isSubmitDisabled, eventNames, isResetDisabled,
    } = this.state;
    return (
      <div styleName="status-details-parent">
        <span styleName="newBulkUpload">
          {'New Event Request'}
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

  renderResults() {
    const { resultData } = this.props;
    const { isVisible } = this.state;
    return (
      <Grid item xs={12}>
        <TabView onChange={this.handleTabChange} tableData={resultData} />
        {isVisible && (
          <div styleName="errorSvginfo">
            <ErrorIcon styleName="errorSvg" />
            <Button
              className="material-ui-button"
              color="primary"
              id="download"
              margin="normal"
              onClick={this.handleDownload}
              startIcon={<GetAppIcon />
              }
              styleName="submitButton"
              variant="contained"
            >
              DOWNLOAD EXCEL TO VERIFY
            </Button>
          </div>
        )}
      </Grid>
    );
  }

  render() {
    const { inProgress, resultOperation } = this.props;
    const { isOpen } = this.state;
    const title = '';
    let renderAlert = null;
    if (resultOperation && resultOperation.status) {
      renderAlert = (
        <SweetAlertBox
          message={resultOperation.status}
          onConfirm={this.handleClose}
          show={isOpen}
          type={resultOperation.level}
        />
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
              <div styleName="title-row">
                {renderAlert}
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
  resultData: {
    DocumentRequests: [],
    invalidCases: [],
  },
  resultOperation: { level: '', status: '' },
};

CoviusBulkOrder.propTypes = {
  coviusSubmitData: PropTypes.shape.isRequired,
  inProgress: PropTypes.bool,
  onCoviusBulkSubmit: PropTypes.func,
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
  coviusSubmitData: selectors.getCoviusSubmitData(state),

});

const mapDispatchToProps = dispatch => ({
  onCoviusBulkSubmit: operations.onCoviusCasesSubmit(dispatch),
});

const CoviusBulkOrderContainer = connect(mapStateToProps, mapDispatchToProps)(CoviusBulkOrder);

const TestHooks = {
  CoviusBulkOrder,
};

export { TestHooks };
export default withRouter(CoviusBulkOrderContainer);
