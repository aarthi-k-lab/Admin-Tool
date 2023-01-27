import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import './RFDContent.css';
import { connect } from 'react-redux';
import { operations, selectors } from 'ducks/tombstone';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import * as moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import * as R from 'ramda';
import MUITable from 'components/MUITable/MUITable';
import Loader from 'components/Loader';
import Tooltip from '@material-ui/core/Tooltip';
import ErrorIcon from '@material-ui/icons/Error';
import { RFD_DIALOG_MSG, RFD_SAVE_INFO, RFD_TITLE } from '../../../../constants/loanInfoComponents';
import ConfirmationDialogBox from '../../../Tasks/OptionalTask/ConfirmationDialogBox';

const RFD_TABLE_COLUMNS = [
  {
    name: 'date',
    label: 'Date',
    align: 'left',
    minWidthHead: 120,
    options: {
      filter: true,
      sort: false,
      toolTip: {
        title: 'Filter Date',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: value => moment(value).format('MM/DD/YYYY'),
  },
  {
    name: 'userName',
    label: 'User',
    align: 'left',
    minWidthHead: 150,
    options: {
      filter: true,
      sort: false,
      toolTip: {
        title: 'Filter User',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: value => value && value.replace('.', ' ').replace('@mrcooper.com', ''),
  },
  {
    name: 'reasonDescription',
    label: 'Reason Description',
    align: 'left',
    minWidthHead: 190,
    options: {
      filter: true,
      sort: false,
      toolTip: {
        title: 'Filter Reason Description',
        size: 'small',
        color: 'action',
      },
    },
  },
  {
    name: 'comments',
    label: 'Comments',
    align: 'left',
    minWidthHead: 180,
    options: {
      filter: false,
      sort: false,
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
  },
];


class RFDContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rfdDate: new Date().toISOString().substring(0, 10),
      reasonCode: '',
      comments: '',
      pandemicImpact: 'No',
      reasonDesc: '',
      disableButton: true,
      openConfirmDialog: false,
    };
    this.handleDateRFDChange = this.handleDateRFDChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleCommentsChange = this.handleCommentsChange.bind(this);
    this.handlePandemicChoice = this.handlePandemicChoice.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    const { onGetReasonDescOptions } = this.props;
    onGetReasonDescOptions();
  }

  handleDateRFDChange = (event) => {
    this.setState({
      rfdDate: new Date(event.target.value).toISOString().substring(0, 10),
    });
  };

  handleSelectChange = (event) => {
    this.setState({
      reasonCode: event.target.value,
      reasonDesc: event.currentTarget.innerText,
    });
  };

  handleCommentsChange = (event) => {
    if (R.length(event.target.value) <= 1000) {
      this.setState({
        comments: event.target.value,
      });
    }
  }

  handlePandemicChoice = (event) => {
    this.setState({
      pandemicImpact: event.target.value,
    });
  }

  handleSave = () => {
    const { onSaveRFDDetails, loanNumber } = this.props;
    const {
      comments, reasonCode, pandemicImpact, reasonDesc,
    } = this.state;
    const pandemicValue = R.equals(pandemicImpact, 'Yes');
    if (comments && reasonCode && pandemicImpact) {
      const payload = {
        loanId: loanNumber,
        comments,
        pandemicImpacted: pandemicValue,
        reasonForDefaultCode: reasonCode,
        reasonForDefault: reasonDesc,
      };
      this.setState({
        reasonCode: '',
        reasonDesc: '',
        comments: '',
        pandemicImpact: 'No',
      });
      onSaveRFDDetails(payload);
    }
  }

  handleClose = () => {
    const { comments, reasonCode } = this.state;
    const { setChecklistCenterPaneData } = this.props;
    const value = R.isEmpty(R.trim(comments)) && R.isEmpty(R.trim(reasonCode));
    if (!value) {
      this.setState({
        openConfirmDialog: true,
      });
    } else {
      setChecklistCenterPaneData('Checklist');
    }
  }

  handleDisableSave = () => {
    const {
      comments, reasonCode,
    } = this.state;
    const value = R.isEmpty(R.trim(comments)) || R.isEmpty(R.trim(reasonCode));
    this.setState({
      disableButton: value,
    });
    return value;
  }

  handleAlertDialogClose(isConfirmed) {
    const { setChecklistCenterPaneData } = this.props;
    this.setState({
      openConfirmDialog: false,
    });
    if (R.equals(isConfirmed, true)) {
      setChecklistCenterPaneData('Checklist');
    }
  }

  render() {
    const {
      loanNumber, reasonDescriptionOptions, loading, rfdTableData,
    } = this.props;
    const {
      rfdDate, reasonCode, comments, pandemicImpact, disableButton, openConfirmDialog,
    } = this.state;
    return (
      <Grid container elevation={0}>
        <Grid itme xs={11}>
          <Typography styleName="heading">
            {RFD_TITLE}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={this.handleClose} styleName="closeIcon">
            <CloseIcon />
          </IconButton>
        </Grid>
        <Grid xs={4}>
          <Paper elevation={0}>
            <Box styleName="leftBox">
              <Grid container spacing={2}>
                <Grid elevation={0} item xs={5}>
                  <Typography styleName="formMargin">
                    Loan ID
                  </Typography>
                </Grid>
                <Grid elevation={0} item styleName="rightAllignment" xs={7}>
                  <TextField
                    disabled
                    fullWidth
                    id="fullWidth"
                    size="small"
                    value={loanNumber}
                    variant="outlined"
                  />
                </Grid>
                <Grid elevation={0} item xs={5}>
                  <Typography styleName="formMargin">
                    Date
                  </Typography>
                </Grid>
                <Grid elevation={0} item styleName="rightAllignment" xs={7}>
                  <TextField
                    disabled
                    fullWidth
                    id="date"
                    onChange={this.handleDateRFDChange}
                    size="small"
                    type="date"
                    value={rfdDate}
                    variant="outlined"
                  />
                </Grid>
                <Grid elevation={0} item xs={5}>
                  <Typography styleName="formMargin">
                    Reason Description
                    <span styleName="requiredField">*</span>
                  </Typography>
                </Grid>
                <Grid elevation={0} item styleName="rightAllignment" xs={7}>
                  <FormControl fullWidth size="small">
                    <Select
                      displayEmpty
                      id="demo-multiple-name"
                      input={<OutlinedInput />}
                      labelId="demo-multiple-name-label"
                      onChange={this.handleSelectChange}
                      value={reasonCode}
                    >
                      {reasonDescriptionOptions.map(({ reason, value }) => (
                        <MenuItem key={value} value={value}>
                          {reason}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid elevation={0} item xs={5}>
                  <Typography styleName="formMargin">
                    Comments
                    <span styleName="requiredField">*</span>
                  </Typography>
                </Grid>
                <Grid elevation={0} item xs={7}>
                  <TextField
                    id="outlined-multiline-static"
                    inputProps={{ maxLength: 1000 }}
                    multiline
                    onChange={this.handleCommentsChange}
                    rows={6}
                    styleName="fullWidth"
                    value={comments}
                    variant="outlined"
                  />
                </Grid>
                <Grid elevation={0} item xs={5}>
                  <Typography styleName="formMargin">
                    Pandemic Impacted?
                  </Typography>
                </Grid>
                <Grid elevation={0} item styleName="rightAllignment" xs={7}>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      onChange={this.handlePandemicChoice}
                      row
                      value={pandemicImpact}
                    >
                      <FormControlLabel
                        control={<Radio />}
                        label="Yes"
                        value="Yes"
                      />
                      <FormControlLabel
                        control={<Radio />}
                        label="No"
                        value="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Divider light styleName="divider" />
              <Grid alignItems="center" elevation={0} justify="flex-end" xs={12}>
                <Button
                  className="material-ui-button"
                  disabled={this.handleDisableSave()}
                  onClick={this.handleSave}
                  styleName={disableButton ? 'disabledSaveButton' : 'saveButton'}
                  variant="contained"
                >
                  Save
                </Button>
                <span styleName="errorIcon">
                  <Tooltip
                    placement="right-start"
                    title={(
                      <Typography>
                        {RFD_SAVE_INFO}
                      </Typography>
                    )}
                  >
                    <ErrorIcon styleName="errorSvg" />
                  </Tooltip>
                </span>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        <Grid xs={8}>
          {loading ? <Loader message="Please Wait" />
            : (
              <Grid item styleName="rfdTable" xs={12}>
                <Typography styleName="tableTitle">Reason(s) History</Typography>
                <MUITable columns={RFD_TABLE_COLUMNS} data={rfdTableData} />
              </Grid>
            )}
        </Grid>
        <ConfirmationDialogBox
          isOpen={openConfirmDialog}
          message=""
          onClose={isConfirmed => this.handleAlertDialogClose(isConfirmed)}
          title={RFD_DIALOG_MSG}
        />
      </Grid>
    );
  }
}
RFDContent.defaultProps = {
  loanNumber: '',
  rfdTableData: [],
  reasonDescriptionOptions: [],
  onSaveRFDDetails: () => { },
  loading: false,
};

RFDContent.propTypes = {
  loading: PropTypes.bool,
  loanNumber: PropTypes.number,
  onGetReasonDescOptions: PropTypes.func.isRequired,
  onSaveRFDDetails: PropTypes.func,
  reasonDescriptionOptions: PropTypes.arrayOf(PropTypes.shape),
  rfdTableData: PropTypes.arrayOf(PropTypes.shape),
  setChecklistCenterPaneData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  loanNumber: dashboardSelectors.loanNumber(state),
  rfdTableData: selectors.getRFDTableData(state),
  reasonDescriptionOptions: selectors.getReasonDescriptionOptions(state),
  loading: selectors.getLoader(state),
});

const mapDispatchToProps = dispatch => ({
  onGetReasonDescOptions: operations.getRFDReasonDescDropdownOperation(dispatch),
  setChecklistCenterPaneData: operations.setChecklistCenterPaneDataOperation(dispatch),
  onSaveRFDDetails: operations.onSubmitToRFDRequestOperation(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RFDContent);
