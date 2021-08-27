import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectors, operations } from 'ducks/dashboard';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import SweetAlertBox from 'components/SweetAlertBox';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Error';
import Tooltip from '@material-ui/core/Tooltip';
import './FHLMCWidget.css';
import * as R from 'ramda';
import { PropTypes } from 'prop-types';
import FHLMCDataInsight from '../../containers/Dashboard/FhlmcResolve/FHLMCDataInsight';

class FHLMCWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRequestType: '',
      portfolioCode: '',
    };
    this.handleRequestType = this.handleRequestType.bind(this);
    this.renderCategoryDropDown = this.renderCategoryDropDown.bind(this);
  }

  componentDidMount() {
    const { populateInvestorDropdown } = this.props;
    populateInvestorDropdown();
  }

  renderCategoryDropDown = () => {
    const { selectedRequestType } = this.state;
    const { investorEvents, stagerTaskName } = this.props;
    const requestType = R.compose(R.uniq, R.pluck('requestType'), R.flatten)(investorEvents);
    const handledRequestType = !R.equals(R.pathOr('', ['activeTile'], stagerTaskName), 'Investor Settlement') ? R.reject(R.equals('SETReq'))(requestType) : requestType;
    return (
      <>
        <div styleName="requestCategoryDropdown">
          <span>
            {'Request Type'}
          </span>
          <span styleName="errorIcon">
            <Tooltip
              placement="right-end"
              title={(
                <Typography>
                  This is the type of action or information that you
                  want to send to FHLMC. What type of message is this?
                </Typography>
              )}
            >
              <ErrorIcon styleName={!R.isEmpty(selectedRequestType) ? 'errorSvgSelected' : 'errorSvg'} />
            </Tooltip>
          </span>
        </div>
        <div>
          <FormControl variant="outlined">
            <InputLabel styleName={!R.isEmpty(selectedRequestType) ? 'inputLblSelected' : 'inputLbl'}>Please Select</InputLabel>
            <Select
              id="requestCategoryDropdown"
              input={<OutlinedInput name="selectedEventCategory" />}
              label="category"
              onChange={this.handleRequestType}
              styleName="drop-down-select"
              value={selectedRequestType}
            >
              {handledRequestType.map(item => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div styleName="divider">
          <Divider />
        </div>
      </>
    );
  }

  handleRequestType = (event) => {
    const { investorEvents } = this.props;
    const portFolioCode = R.find(item => item.requestType === event.target.value, investorEvents);
    this.setState({
      selectedRequestType: event.target.value,
      portfolioCode: portFolioCode.portfolioCode,
    });
  }

  handleClose = () => {
    const { closeSweetAlert, resultOperation } = this.props;
    if (resultOperation.clearData) {
      this.onResetClick();
    }
    closeSweetAlert();
  }

  render() {
    const { selectedRequestType, portfolioCode } = this.state;
    const { resultOperation } = this.props;
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
      <section>
        {renderAlert}
        <Typography styleName="title">FHLMC</Typography>
        <div styleName="divider">
          <Divider />
        </div>
        {this.renderCategoryDropDown()}
        <FHLMCDataInsight
          isWidget
          portfolioCode={portfolioCode}
          selectedRequestType={selectedRequestType}
          submitCases
        />

      </section>
    );
  }
}

FHLMCWidget.defaultProps = {
  populateInvestorDropdown: () => { },
  investorEvents: [],
  resultOperation: {},
  stagerTaskName: {},
};

FHLMCWidget.propTypes = {
  closeSweetAlert: PropTypes.func.isRequired,
  investorEvents: PropTypes.arrayOf(PropTypes.String),
  populateInvestorDropdown: PropTypes.func,
  resultOperation: PropTypes.shape({
    clearData: PropTypes.string,
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    showConfirmButton: PropTypes.bool,
    status: PropTypes.string,
    title: PropTypes.string,
  }),
  stagerTaskName: PropTypes.shape(),
};

const mapStateToProps = state => ({
  investorEvents: selectors.getInvestorEvents(state),
  resultOperation: selectors.resultOperation(state),
  stagerTaskName: selectors.stagerTaskName(state),
});

const mapDispatchToProps = dispatch => ({
  closeSweetAlert: operations.closeSweetAlert(dispatch),
  populateInvestorDropdown: operations.populateInvestorEvents(dispatch),
});

export { FHLMCWidget };

export default connect(mapStateToProps, mapDispatchToProps)(FHLMCWidget);
