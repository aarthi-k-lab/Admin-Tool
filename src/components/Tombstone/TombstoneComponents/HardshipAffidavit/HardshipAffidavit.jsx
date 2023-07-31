import {
  IconButton,
  Typography,
  Grid,
  Paper,
  Button,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectors as loginSelectors } from 'ducks/login';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import { selectors as incomeCalcSelectors } from 'ducks/income-calculator';
import { selectors as tombstoneSelectors, operations } from '../../../../state/ducks/tombstone';
import { selectors as widgetSelectors } from '../../../../state/ducks/widgets';
import { HARDSHIP_AFFIDAVIT_TITLE, HARDSHIP_DIALOG_MSG, DECEASED_BORROWER } from '../../../../constants/loanInfoComponents';
import ConfirmationDialogBox from '../../../Tasks/OptionalTask/ConfirmationDialogBox';
import './HardshipAffidavit.css';
import processBorrowerData from '../../../../lib/CustomFunctions/BorrowerData/processBorrowerData';

class HardshipAffidavit extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      source: '',
      hardshipType: '',
      beginDate: '',
      endDate: '',
      ethnicity: '',
      race: '',
      sex: '',
      tabIndex: 0,
      openConfirmDialog: false,
      selectedBorrowerId: '',
      disableButton: true,
      selectedBorrowerDescription: '',
    };
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAlertDialogClose = this.handleAlertDialogClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleHardshipDataChange = this.handleHardshipDataChange.bind(this);
    this.renderBorrowerBanner = this.renderBorrowerBanner.bind(this);
    this.renderHardshipInfo = this.renderHardshipInfo.bind(this);
    this.renderHmdaInfo = this.renderHmdaInfo.bind(this);
    this.renderSelect = this.renderSelect.bind(this);
  }

  componentDidMount() {
    const { tabIndex } = this.state;
    const {
      getborrowerData,
    } = this.props;
    const borrId = R.propOr('', 'borrowerId', R.find(R.propEq('borrowerPstnNumber',
      (tabIndex + 1)))(getborrowerData));
    const borrDescription = R.propOr('', 'description', R.find(R.propEq('borrowerPstnNumber',
      (tabIndex + 1)))(getborrowerData));
    this.setState({ selectedBorrowerId: borrId, selectedBorrowerDescription: borrDescription });
    this.getDataOnLoad();
  }

  async getDataOnLoad() {
    const { onGetHardhsipData, populateHardshipDropdownData } = this.props;
    await onGetHardhsipData();
    await populateHardshipDropdownData();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const hardshipData = nextProps.getHardshipData;
    const currentHardshipData = hardshipData.find(
      item => item.id.borrowerId === prevState.selectedBorrowerId,
    );

    const updatedHardship = nextProps.getUpdatedHardshipData;
    const isDisabled = updatedHardship.some(data => data.source && data.hardshipType
      && (data.hardshipBeginDate || nextProps.getHardshipBeginDate)
      && (data.hardshipEndDate || nextProps.getHardshipEndDate));

    if (!R.isNil(currentHardshipData) && !R.isEmpty(currentHardshipData)) {
      const {
        source, hardshipType, hardshipBeginDate: beginDate, hardshipEndDate: endDate,
        ethnicity, race, sex,
      } = currentHardshipData;
      const borrowerId = (currentHardshipData && currentHardshipData.id
        && currentHardshipData.id.borrowerId)
        ? currentHardshipData.id.borrowerId : null;
      return {
        source,
        hardshipType,
        ethnicity,
        race,
        sex,
        beginDate: beginDate || nextProps.getHardshipBeginDate,
        endDate: endDate || nextProps.getHardshipEndDate,
        borrowerId,
        disableButton: !isDisabled,
        prevGetHardshipData: nextProps.getHardshipData,
      };
    }

    return {
      source: '',
      hardshipType: '',
      beginDate: nextProps.getHardshipBeginDate,
      endDate: nextProps.getHardshipEndDate,
      ethnicity: '',
      race: '',
      sex: '',
      borrowerId: '',
      disableButton: !isDisabled,
      prevGetHardshipData: nextProps.getHardshipData,
    };
  }

  handleTabChange = (selectedIndex) => {
    const {
      getborrowerData,
      getHardshipData,
    } = this.props;

    this.setState({ tabIndex: selectedIndex });
    const borrId = R.propOr('', 'borrowerId', R.find(R.propEq('borrowerPstnNumber',
      (selectedIndex + 1)))(getborrowerData));
    const borrDescription = R.propOr('', 'description', R.find(R.propEq('borrowerPstnNumber',
      (selectedIndex + 1)))(getborrowerData));
    this.setState({ selectedBorrowerId: borrId, selectedBorrowerDescription: borrDescription });

    const selectedBorrowerHardshipData = getHardshipData.filter(
      data => data.id.borrowerId === borrId,
    )[0];
    if (selectedBorrowerHardshipData) {
      const {
        source, hardshipType, hardshipBeginDate: beginDate, hardshipEndDate: endDate,
        ethnicity, race, sex,
      } = selectedBorrowerHardshipData;
      this.setState({
        source,
        hardshipType,
        ethnicity,
        race,
        sex,
        beginDate: beginDate || '',
        endDate: endDate || '',
      });
    } else {
      this.setState({
        hardshipType: '',
        source: '',
        beginDate: '',
        endDate: '',
        ethnicity: '',
        race: '',
        sex: '',
      });
    }
  };

  getFilteredHardshipInfo = hardshipInfo => hardshipInfo.filter((data) => {
    if (data.source && data.hardshipType
      && data.hardshipBeginDate && data.hardshipEndDate) return true;
    return false;
  });

  getHardshipRequestData = (hardshipInfo) => {
    const { evalId, userPrincipal: user } = this.props;
    const hardshipReqData = hardshipInfo.map((data) => {
      const {
        source: hardshipSource, hardshipType, hardshipBeginDate, hardshipEndDate,
        ethnicity, race, sex, id: { borrowerId },
      } = data;
      return {
        evalId,
        borrowerId,
        user,
        hardshipSource,
        hardshipType,
        beginDate: hardshipBeginDate,
        endDate: hardshipEndDate,
        ethnicity,
        race,
        sex,
      };
    });
    return hardshipReqData;
  };

  getTkamsRequestData = (hardshipInfo) => {
    const { loanId } = this.props;
    const borrowerHardshipInfo = hardshipInfo.find(data => data.selectedBorrowerDescription === 'Borrower 1');
    const coBorrowerHardshipInfo = hardshipInfo.find(data => data.selectedBorrowerDescription === 'Co-Borrower 1');

    if (!R.isEmpty(borrowerHardshipInfo) || !R.isEmpty(coBorrowerHardshipInfo)) {
      let borrowerObj = {};
      let coBorrowerObj = {};
      if (borrowerHardshipInfo) {
        const {
          source: asbCollectionMethod, hardshipType: asbHardshipType,
          hardshipBeginDate: asbHardshipBeginDate, hardshipEndDate: asbHardshipEndDate,
          ethnicity: asbEthnicity, race: asbRace, sex: asbSex,
        } = borrowerHardshipInfo;
        borrowerObj = borrowerHardshipInfo ? {
          asbCollectionMethod,
          asbHardshipType,
          asbHardshipBeginDate,
          asbHardshipEndDate,
          asbEthnicity,
          asbRace,
          asbSex,
        } : {};
      }

      if (coBorrowerHardshipInfo) {
        const {
          source: asCoBCollectionMethod, hardshipType: asCoBHardshipType,
          hardshipBeginDate: asCoBHardshipBeginDate, hardshipEndDate: asCoBHardshipEndDate,
          ethnicity: asCoBEthnicity, race: asCoBRace, sex: asCoBSex,
        } = coBorrowerHardshipInfo;
        coBorrowerObj = coBorrowerHardshipInfo ? {
          asCoBCollectionMethod,
          asCoBHardshipType,
          asCoBHardshipBeginDate,
          asCoBHardshipEndDate,
          asCoBEthnicity,
          asCoBRace,
          asCoBSex,
        } : {};
      }


      const tkamsBorrowerInfo = { ...borrowerObj, ...coBorrowerObj };
      return { loanId: +loanId, ...tkamsBorrowerInfo };
    }
    return null;
  };

  handleHardshipDataChange(event, key) {
    const { value } = event && event.target;
    const {
      selectedBorrowerId, selectedBorrowerDescription,
    } = this.state;
    const {
      setHardshipInfo,
      setUpdatedBorrowerHardshipInfo,
    } = this.props;
    setHardshipInfo({
      value, key, selectedBorrowerId, selectedBorrowerDescription,
    });
    setUpdatedBorrowerHardshipInfo({ key, value, selectedBorrowerId });
  }

  handleClose() {
    const { getUpdatedHardshipData, setChecklistCenterPaneData } = this.props;
    if (getUpdatedHardshipData && getUpdatedHardshipData.length > 0) {
      this.setState({ openConfirmDialog: true });
    } else {
      setChecklistCenterPaneData('Checklist');
    }
  }

  handleAlertDialogClose(isConfirmed) {
    const { clearHardshipData, clearUpdatedHardshipData, setChecklistCenterPaneData } = this.props;
    this.setState({
      openConfirmDialog: false,
    });
    if (R.equals(isConfirmed, true)) {
      this.setState({
        hardshipType: '',
        source: '',
        beginDate: '',
        endDate: '',
        ethnicity: '',
        race: '',
        sex: '',
      });
      setChecklistCenterPaneData('Checklist');
      clearHardshipData();
      clearUpdatedHardshipData();
    }
  }

  handleSave() {
    const { saveHardshipDetails, getHardshipData, getUpdatedHardshipData } = this.props;
    // To get only the borrowers detail where all the mandatory fields are filled
    const updatedHardshipInfo = this.getFilteredHardshipInfo(getUpdatedHardshipData);
    const hardshipInfo = this.getFilteredHardshipInfo(getHardshipData);

    const hardshipReqData = this.getHardshipRequestData(updatedHardshipInfo);
    const tkamsReqData = this.getTkamsRequestData(hardshipInfo);
    const payload = { hardshipReqData, tkamsReqData };
    saveHardshipDetails(payload);
  }

  renderBorrowerBanner(displayList, tabIndex) {
    return (
      <Grid item styleName="tabWidth">
        <Paper elevation={1} square styleName="borrowerBanner">
          <Tabs
            inkBarStyle={{ background: '#596feb' }}
            onChange={(_, currentIndex) => this.handleTabChange(currentIndex)}
            scrollable="true"
            styleName="hardship-borr-tabs"
            value={tabIndex}
            variant="scrollable"
          >
            {displayList && displayList.map(task => (
              <Tab
                key={R.propOr('', 'description', task)}
                disabled={R.propOr('', 'name', task).includes(DECEASED_BORROWER)}
                label={(
                  <div styleName="tabContainer">
                    <div styleName="taballign">
                      <div styleName="borrNameDiv">
                        <Typography styleName="borrName" variant="subtitle1">
                          {task && R.propOr('', 'name', task)}
                        </Typography>
                        <Typography styleName="borrDesc" variant="subtitle2">
                          {task && R.propOr('', 'description', task)}
                        </Typography>
                      </div>
                    </div>
                  </div>
              )}
                styleName="borrTab"
              />
            ))}
          </Tabs>
        </Paper>
      </Grid>
    );
  }

  renderSelect(value, dropdownData, key) {
    return (
      <Grid item xs={5}>
        <Select
          defaultValue=""
          displayEmpty
          onChange={e => this.handleHardshipDataChange(e, key)}
          required
          size="small"
          styleName="hardship-select"
          value={!R.isNil(value) ? value : ''}
          variant="outlined"
        >
          <MenuItem disabled styleName="menu-item" value="">Select</MenuItem>
          {dropdownData.map(sourceDpDwnVal => (
            <MenuItem
              key={sourceDpDwnVal.classCode}
              styleName="menu-item"
              value={sourceDpDwnVal.classCode}
            >
              {sourceDpDwnVal.classCode}
            </MenuItem>
          ))}
        </Select>
      </Grid>
    );
  }

  renderHardshipInfo(source,
    hardshipType, beginDate, endDate, sourceDropDownData, typeDropDownData, isDeceasedBorrower) {
    const hardshipStyle = isDeceasedBorrower ? 'hardshipContainer-disabled ' : 'hardshipContainer';
    return (
      <Grid disabled={isDeceasedBorrower} item>
        <div styleName={`${hardshipStyle}`}>
          <Grid container spacing={2}>
            <Typography>
          Hardship Information
            </Typography>
          </Grid>
          <Grid item styleName="hardship-field-container" xs={12}>
            <Grid container spacing={2} styleName="hardship-field">
              <Grid item styleName="hardship-label" xs={4}>
                <div>
              Source
                  {' '}
                </div>
              </Grid>
              {this.renderSelect(source, sourceDropDownData, 'source')}
            </Grid>
          </Grid>
          <Grid item styleName="hardship-field-container" xs={12}>
            <Grid container spacing={2} styleName="hardship-field">
              <Grid item styleName="hardship-label" xs={4}>
                <div>
              Hardship Type
                  {' '}
                </div>

              </Grid>
              {this.renderSelect(hardshipType, typeDropDownData, 'hardshipType')}
            </Grid>
          </Grid>
          <Grid item styleName="hardship-field-container" xs={12}>
            <Grid container spacing={2} styleName="hardship-field">
              <Grid item styleName="hardship-label" xs={4}><div>Begin Date</div></Grid>
              <Grid item xs={3}>
                <TextField
                  inputProps={{
                    max: new Date().toISOString().split('T')[0],
                  }}
                  onChange={e => this.handleHardshipDataChange(e, 'hardshipBeginDate')}
                  size="small"
                  styleName="hardship-date-field"
                  type="date"
                  value={beginDate}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item styleName="hardship-field-container" xs={12}>
            <Grid container spacing={2} styleName="hardship-field">
              <Grid item styleName="hardship-label" xs={4}><div>End Date</div></Grid>
              <Grid item xs={3}>
                <TextField
                  id="outlined-required"
                  inputProps={{
                    max: new Date().toISOString().split('T')[0],
                  }}
                  onChange={e => this.handleHardshipDataChange(e, 'hardshipEndDate')}
                  size="small"
                  styleName="hardship-date-field"
                  type="date"
                  value={endDate}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Grid>
    );
  }

  renderHmdaInfo(race,
    sex, ethnicity, sexDropDownData, ethnicityDropDownData, raceDropDownData, isDeceasedBorrower) {
    const hmdaStyle = isDeceasedBorrower ? 'hmdaContainer-disabled' : 'hmdaContainer';
    return (
      <Grid item>
        <div styleName={`${hmdaStyle}`}>
          <Grid container spacing={2}>
            <Typography>
            HMDA
            </Typography>
          </Grid>
          <Grid item styleName="hardship-field-container" xs={12}>
            <Grid container spacing={2} styleName="hardship-field">
              <Grid item styleName="hardship-label" xs={4}>
                <div>
                Ethnicity
                  {' '}
                </div>

              </Grid>
              {this.renderSelect(ethnicity, ethnicityDropDownData, 'ethnicity')}
            </Grid>
          </Grid>
          <Grid item styleName="hardship-field-container" xs={12}>
            <Grid container spacing={2} styleName="hardship-field">
              <Grid item styleName="hardship-label" xs={4}>
                <div>
                Race
                  {' '}
                </div>

              </Grid>
              {this.renderSelect(race, raceDropDownData, 'race')}
            </Grid>
          </Grid>
          <Grid item styleName="hardship-field-container" xs={12}>
            <Grid container spacing={2} styleName="hardship-field">
              <Grid item styleName="hardship-label" xs={4}>
                <div>
                Sex
                  {' '}
                </div>

              </Grid>
              {this.renderSelect(sex, sexDropDownData, 'sex')}
            </Grid>
          </Grid>
        </div>
      </Grid>
    );
  }

  render() {
    const {
      tabIndex, hardshipType, source, ethnicity, race, sex, openConfirmDialog,
      beginDate,
      endDate, disableButton,
    } = this.state;
    const {
      getborrowerData, ethnicityDropDownData, raceDropDownData,
      sexDropDownData, sourceDropDownData, typeDropDownData,
    } = this.props;
    const displayList = processBorrowerData(getborrowerData);

    const borrowerName = R.propOr('', 'firstName', R.find(R.propEq('borrowerPstnNumber',
      (tabIndex + 1)))(getborrowerData));
    const isDeceasedBorrower = borrowerName.includes('ESTATE OF');
    return (
      <Grid container elevation={0}>
        <div styleName="hardship-container">
          <Grid item xs={10}>
            <Typography styleName="heading">
              {HARDSHIP_AFFIDAVIT_TITLE}
            </Typography>
          </Grid>
          <Grid alignItems="center" elevation={0}>
            <Button
              className="material-ui-button"
              disabled={disableButton}
              onClick={this.handleSave}
              styleName={disableButton ? 'disabledSaveButton' : 'saveButton'}
              variant="contained"
            >
              Save
            </Button>
          </Grid>
          <Grid item styleName="closeIcon">
            <IconButton onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </div>
        <Grid item styleName="borr-banner-container" xs={9}>
          <Grid container direction="column">
            {this.renderBorrowerBanner(displayList, tabIndex)}
            <div styleName="header">
              {this.renderHardshipInfo(source, hardshipType, beginDate,
                endDate, sourceDropDownData, typeDropDownData, isDeceasedBorrower)}
              {this.renderHmdaInfo(race, sex, ethnicity,
                sexDropDownData, ethnicityDropDownData, raceDropDownData, isDeceasedBorrower)}
            </div>
          </Grid>

        </Grid>
        <ConfirmationDialogBox
          isOpen={openConfirmDialog}
          message=""
          onClose={isConfirmed => this.handleAlertDialogClose(isConfirmed)}
          title={HARDSHIP_DIALOG_MSG}
        />
      </Grid>
    );
  }
}

HardshipAffidavit.defaultProps = ({
  getborrowerData: () => { },
  evalId: '',
  userPrincipal: '',
  loanId: '',
});

HardshipAffidavit.propTypes = {
  clearHardshipData: PropTypes.func.isRequired,
  clearUpdatedHardshipData: PropTypes.func.isRequired,
  ethnicityDropDownData: PropTypes.func.isRequired,
  evalId: PropTypes.number,
  getborrowerData: PropTypes.arrayOf(PropTypes.shape),
  getHardshipData: PropTypes.func.isRequired,
  getUpdatedHardshipData: PropTypes.func.isRequired,
  loanId: PropTypes.number,
  onGetHardhsipData: PropTypes.func.isRequired,
  populateHardshipDropdownData: PropTypes.func.isRequired,
  raceDropDownData: PropTypes.func.isRequired,
  saveHardshipDetails: PropTypes.func.isRequired,
  setChecklistCenterPaneData: PropTypes.func.isRequired,
  setHardshipInfo: PropTypes.func.isRequired,
  setUpdatedBorrowerHardshipInfo: PropTypes.func.isRequired,
  sexDropDownData: PropTypes.func.isRequired,
  sourceDropDownData: PropTypes.func.isRequired,
  typeDropDownData: PropTypes.func.isRequired,
  userPrincipal: PropTypes.string,
};

const mapStateToProps = state => ({
  getborrowerData: incomeCalcSelectors.getBorrowers(state),
  openWidgetList: widgetSelectors.getOpenWidgetList(state),
  getHardshipData: tombstoneSelectors.getHardshipData(state),
  getUpdatedHardshipData: tombstoneSelectors.getUpdatedHardshipData(state),
  getHardshipBeginDate: tombstoneSelectors.getHardshipBeginDate(state),
  getHardshipEndDate: tombstoneSelectors.getHardshipEndDate(state),
  sourceDropDownData: tombstoneSelectors.getHardshipSourceDropDownData(state),
  typeDropDownData: tombstoneSelectors.getHardshipTypeDropDownData(state),
  ethnicityDropDownData: tombstoneSelectors.getHardshipEthnicityDropDownData(state),
  raceDropDownData: tombstoneSelectors.getHardshipRaceDropDownData(state),
  sexDropDownData: tombstoneSelectors.getHardshipSexDropDownData(state),
  evalId: dashboardSelectors.evalId(state),
  loanId: dashboardSelectors.loanNumber(state),
  userPrincipal: loginSelectors.getUserPrincipalName(state),
  getModViewData: tombstoneSelectors.getTombstoneModViewData(state),
  isAssigned: dashboardSelectors.isAssigned(state),
});

const mapDispatchToProps = dispatch => ({
  clearHardshipData: operations.clearHardshipDataOperation(dispatch),
  clearUpdatedHardshipData: operations.clearUpdatedHardshipDataOperation(dispatch),
  setChecklistCenterPaneData: operations.setChecklistCenterPaneDataOperation(dispatch),
  onGetHardhsipData: operations.fetchHardshipDataOperation(dispatch),
  populateHardshipDropdownData: operations.populateHardshipDropdownOperation(dispatch),
  saveHardshipDetails: operations.saveHardshipDataOperation(dispatch),
  setHardshipInfo: operations.updateHardshipDataOperation(dispatch),
  setUpdatedBorrowerHardshipInfo: operations.setUpdateBorrwerHardshipDataOperation(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(HardshipAffidavit);
