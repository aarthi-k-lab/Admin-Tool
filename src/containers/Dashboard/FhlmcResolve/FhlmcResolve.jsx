import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import ContentHeader from 'components/ContentHeader';
import Controls from 'containers/Controls';
import { connect } from 'react-redux';
import './FhlmcResolve.css';
import * as R from 'ramda';
import Select from '@material-ui/core/Select';
import UserNotification from 'components/UserNotification';
import Loader from 'components/Loader/Loader';
import SweetAlertBox from 'components/SweetAlertBox';
import ErrorIcon from '@material-ui/icons/Error';
import Tooltip from '@material-ui/core/Tooltip';
import { selectors, operations } from 'ducks/dashboard';
import { PropTypes } from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FHLMCDataInsight from './FHLMCDataInsight';

const renderNoDataText = 'Processed loan information will be displayed here';
const title = 'FHLMC RESOLVE';
class FhlmcResolve extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRequestType: '',
      portfolioCode: '',
      ids: '',
      isSubmitDisabled: 'disabled',
      isResetDisabled: true,
      idType: '',
      renderNoData: true,
    };
    this.handleRequestType = this.handleRequestType.bind(this);
    this.renderFHLMCResolveNotepadArea = this.renderFHLMCResolveNotepadArea.bind(this);
    this.renderCategoryDropDown = this.renderCategoryDropDown.bind(this);
    this.renderSubmitResults = this.renderSubmitResults.bind(this);
    this.renderIdsDropDown = this.renderIdsDropDown.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmitFhlmcResolveRequest = this.onSubmitFhlmcResolveRequest.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
  }

  componentDidMount() {
    const { populateInvestorDropdown } = this.props;
    populateInvestorDropdown();
  }

  onResetClick = () => {
    const { onResetData, dismissUserNotification } = this.props;
    this.setState({
      selectedRequestType: '',
      portfolioCode: '',
      ids: '',
      isSubmitDisabled: 'disabled',
      isResetDisabled: true,
      idType: '',
      renderNoData: true,
    });
    onResetData();
    dismissUserNotification();
  }

  onSubmitFhlmcResolveRequest = () => {
    const {
      ids, selectedRequestType, idType,
    } = this.state;
    const { onFhlmcBulkSubmit } = this.props;
    this.setState({ isSubmitDisabled: 'disabled', renderNoData: false });
    const cases = (R.filter(id => !R.isEmpty(id), ids.trim().replace(/\n/g, ',').split(','))).map(s => parseInt(s.trim(), 10));
    const payload = {
      caseIds: R.filter(caseId => !R.isEmpty(caseId), [...cases]),
      requestType: selectedRequestType,
      requestIdType: idType,
    };
    onFhlmcBulkSubmit(payload);
  }

  handleInputChange = (event) => {
    const { selectedRequestType, idType } = this.state;
    const re = /[a-zA-Z]|[~`(@!#$%^&*+._)=\-[\]\\';/{}|\\":<>?]|^[,]/;
    if (event.target.value === '' || !re.test(event.target.value)) {
      this.setState({
        ids: event.target.value,
        isSubmitDisabled: event.target.value.trim() && !R.isEmpty(selectedRequestType) ? '' : 'disabled',
        isResetDisabled: R.isEmpty(event.target.value.trim()) && R.isEmpty(selectedRequestType),
        idType,
      });
    }
  }

  handleIdsCategory = (event) => {
    const idType = event.target.value;
    this.setState({
      idType,
      ids: '',
    });
  }

  handleClose = () => {
    const { closeSweetAlert, resultOperation } = this.props;
    if (resultOperation.clearData) {
      this.onResetClick();
    }
    closeSweetAlert();
  }

  renderCategoryDropDown = () => {
    const { selectedRequestType } = this.state;
    const { investorEvents } = this.props;
    const requestType = R.compose(R.uniq, R.pluck('requestType'), R.flatten)(investorEvents);
    return (
      <FormControl variant="outlined">
        <Select
          id="requestCategoryDropdown"
          input={<OutlinedInput name="selectedEventCategory" />}
          label="category"
          onChange={this.handleRequestType}
          styleName="drop-down-select"
          value={selectedRequestType}
        >
          {requestType.map(item => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  renderIdsDropDown = () => {
    const { idType } = this.state;
    const idsCategories = ['Case id(s)'];
    return (
      <FormControl variant="outlined">
        <Select
          id="eventIdsDropdown"
          input={<OutlinedInput name="selectedIds" />}
          label="idcategory"
          onChange={this.handleIdsCategory}
          styleName="drop-down-select"
          value={idType}
        >
          {idsCategories && idsCategories.map(item => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  handleRequestType(event) {
    const { investorEvents } = this.props;
    const portFolioCode = R.find(item => item.requestType === event.target.value, investorEvents);
    this.setState({
      selectedRequestType: event.target.value,
      portfolioCode: portFolioCode.portfolioCode,
      isSubmitDisabled: 'disabled',
      isResetDisabled: false,
    });
  }

  renderFHLMCResolveNotepadArea() {
    const {
      ids, isSubmitDisabled, isResetDisabled,
      idType,
    } = this.state;
    return (
      <div styleName="status-details-parent">
        <span styleName="newBulkUpload">
          {title}
          <FormLabel
            className="filled"
            color="primary"
            disabled={isResetDisabled}
            onClick={this.onResetClick}
            styleName={isResetDisabled ? 'reset-button-style' : 'reset-button-style-blue'}
          >
            RESET
          </FormLabel>
        </span>
        <div styleName="loan-numbers">
          <span>
            {'Request Type'}
          </span>
          <span styleName="errorIcon">
            <Tooltip
              placement="left-end"
              title={(
                <Typography>
                  This is the type of action or information that you
                  want to send to FHLMC. What type of message is this?
                </Typography>
              )}
            >
              <ErrorIcon styleName="errorSvg" />
            </Tooltip>
          </span>
        </div>
        {this.renderCategoryDropDown()}
        <div styleName="loan-numbers">
          <span>
            {'ID Type'}
          </span>
          <span styleName="errorIcon">
            <Tooltip
              placement="right-end"
              title={(
                <Typography>
                  This is the type of case Ids?
                </Typography>
              )}
            >
              <ErrorIcon styleName="errorSvg" />
            </Tooltip>
          </span>
        </div>
        {this.renderIdsDropDown()}
        <span styleName="loan-numbers">
          {idType}
        </span>
        <div styleName="status-details">
          <TextField
            id="ids"
            margin="normal"
            multiline
            onChange={event => this.handleInputChange(event)}
            rows={30}
            style={{ width: '95%', resize: 'none' }}
            value={ids}
          />
        </div>
        <div styleName="interactive-button">
          <Button
            className="material-ui-button"
            color="primary"
            disabled={isSubmitDisabled}
            id="submitButton"
            margin="normal"
            onClick={this.onSubmitFhlmcResolveRequest}
            styleName="submitButton"
            variant="contained"
          >
            SUBMIT
          </Button>
        </div>
      </div>
    );
  }

  renderSubmitResults() {
    const { renderNoData, selectedRequestType, portfolioCode } = this.state;
    return (
      <>
        {renderNoData ? (
          <Grid alignItems="center" container justify="center">
            <Grid item>
              <div styleName="nodata">{renderNoDataText}</div>
            </Grid>
          </Grid>
        )
          : (
            <FHLMCDataInsight
              portfolioCode={portfolioCode}
              selectedRequestType={selectedRequestType}
              submitCases
            />
          )
        }
      </>
    );
  }

  render() {
    const {
      inProgress, resultOperation, userNotificationData, dismissUserNotification,
    } = this.props;
    const { message, level, isOpen } = userNotificationData;
    const renderAlert = (
      <SweetAlertBox
        confirmButtonColor="#004261"
        message={resultOperation.status}
        onConfirm={this.handleClose}
        show={resultOperation.isOpen}
        showConfirmButton={resultOperation.showConfirmButton}
        title={resultOperation.title}
        type={resultOperation.level}
      />
    );
    return (
      <section styleName="scroll-wrapper">
        <ContentHeader title={
          (
            <Grid alignItems="center" container>
              <Grid item xs={12}>
                <div styleName="investorLabel">
                  {title}
                </div>
              </Grid>
            </Grid>
          )}
        >
          <Controls />
        </ContentHeader>
        {renderAlert}
        <UserNotification
          dismissUserNotification={dismissUserNotification}
          level={level}
          message={message}
          open={isOpen}
          type="message-banner"
        />
        <Grid container styleName="notepad" xs={12}>
          <Grid item xs={2}>
            {this.renderFHLMCResolveNotepadArea()}
          </Grid>
          <Grid item xs={10}>
            {
              inProgress
                ? <Loader message="Loading" />
                : this.renderSubmitResults()
            }
          </Grid>
        </Grid>
      </section>
    );
  }
}

FhlmcResolve.defaultProps = {
  location: {
    pathname: '',
  },
  investorEvents: [],
  inProgress: false,
  onFhlmcBulkSubmit: () => { },
  onResetData: () => { },
  populateInvestorDropdown: () => { },
  resultOperation: {},
  userNotificationData: {},
};

FhlmcResolve.propTypes = {
  closeSweetAlert: PropTypes.func.isRequired,
  dismissUserNotification: PropTypes.func.isRequired,
  inProgress: PropTypes.bool,
  investorEvents: PropTypes.arrayOf(PropTypes.String),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  onFhlmcBulkSubmit: PropTypes.func,
  onResetData: PropTypes.func,
  populateInvestorDropdown: PropTypes.func,
  resultOperation: PropTypes.shape({
    clearData: PropTypes.string,
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    showConfirmButton: PropTypes.bool,
    status: PropTypes.string,
    title: PropTypes.string,
  }),
  userNotificationData: PropTypes.shape({
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    message: PropTypes.string,
  }),
};

const mapStateToProps = state => ({
  inProgress: selectors.inProgress(state),
  resultOperation: selectors.resultOperation(state),
  investorEvents: selectors.getInvestorEvents(state),
  userNotificationData: selectors.getUserNotification(state),
});

const mapDispatchToProps = dispatch => ({
  onFhlmcBulkSubmit: operations.onFhlmcCasesSubmit(dispatch),
  onResetData: operations.onResetData(dispatch),
  populateInvestorDropdown: operations.populateInvestorEvents(dispatch),
  closeSweetAlert: operations.closeSweetAlert(dispatch),
  dismissUserNotification: operations.onDismissUserNotification(dispatch),
});

const FhlmcResolveContainer = connect(mapStateToProps, mapDispatchToProps)(FhlmcResolve);

const TestHooks = {
  FhlmcResolve,
};

export { TestHooks };
export default FhlmcResolveContainer;
