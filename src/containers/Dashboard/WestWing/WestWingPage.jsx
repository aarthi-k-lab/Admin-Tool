import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ContentHeader from 'components/ContentHeader';
import Controls from 'containers/Controls';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import { operations as widgetsOperation } from 'ducks/widgets';
import { operations as dashboardOperations, selectors as dashboardSelectors } from 'ducks/dashboard';
import WestWingCenterSection from './WestWingCenterSection';
import Popup from '../../../components/Popup';
import {
  ID_CATEGORIES,
  REGEX_COMMON,
} from '../../../constants/westwing';
import './WestWingPage.css';

const title = 'WEST WING';
class WestWingPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      idType: '',
      ids: '',
      isSubmitDisabled: 'disabled',
      isSubmitClicked: false,
    };
  }

    handleInputChange = (event) => {
      const { idType } = this.state;
      if (event.target.value === '' || !REGEX_COMMON.test(event.target.value)) {
        this.setState({
          ids: event.target.value,
          isSubmitDisabled: !event.target.value.trim(),
          idType,
          isSubmitClicked: false,
        });
      }
    }

    handleSubmitClick = () => {
      const { fetchData } = this.props;
      const { ids, idType } = this.state;
      this.setState({ isSubmitClicked: true });
      fetchData({ loanNumber: ids, idType });
    }

    handleIdsCategory = (event) => {
      const idType = event.target.value;
      this.setState({
        idType,
        ids: '',
        isSubmitClicked: false,
      });
    }

  renderIdsDropDown = () => {
    const { idType } = this.state;
    const idsCategories = ID_CATEGORIES;
    return (
      <>
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
      </>
    );
  }

  renderWestWingNotepadArea = () => {
    const { ids, isSubmitDisabled, idType } = this.state;
    return (
      <>
        <div styleName="status-details-parent">
          <div styleName="loan-numbers">
            <span>
              {'Select the option'}
            </span>

          </div>
          {this.renderIdsDropDown()}
          <div styleName="loan-numbers">
            <span>
              {'Enter the loan number'}
            </span>
          </div>
          <div styleName="status-details">
            <TextField
              disabled={idType === ''}
              id="ids"
              margin="normal"
              multiline
              onChange={event => this.handleInputChange(event)}
              style={{ width: '90%', resize: 'none', margin: '1rem' }}
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
              onClick={() => { this.handleSubmitClick(); }}
              styleName="submitButton"
              variant="contained"
            >
            SUBMIT
            </Button>
          </div>
        </div>
      </>
    );
  }

  renderSweetAlert() {
    const { clearPopupData, popupData, dispatchAction } = this.props;
    if (popupData) {
      const {
        isOpen, message, title: popupTitle, level, showCancelButton,
        cancelButtonText, confirmButtonText, onConfirm,
      } = popupData;
      const confirmAction = onConfirm ? dispatchAction : clearPopupData;
      return (
        <Popup
          cancelButtonText={cancelButtonText}
          confirmButtonText={confirmButtonText}
          level={level}
          message={message}
          onCancel={clearPopupData}
          onConfirm={() => confirmAction(onConfirm)}
          show={isOpen}
          showCancelButton={showCancelButton}
          showConfirmButton
          title={popupTitle}
        />
      );
    }
    return null;
  }

  render() {
    const { isSubmitClicked, idType, ids } = this.state;
    return (
      <section>
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
        <Grid container styleName="notepad" xs={12}>
          <Grid item styleName="notepadLeft" xs={2}>
            {this.renderWestWingNotepadArea()}
          </Grid>
          <Grid item styleName="notepadRight" xs={10}>
            <span>
              <WestWingCenterSection
                idType={idType}
                isSubmitClicked={isSubmitClicked}
                loanNumber={ids}
              />
            </span>
          </Grid>
        </Grid>
        {this.renderSweetAlert()}
      </section>
    );
  }
}

WestWingPage.propTypes = {
  clearPopupData: PropTypes.func.isRequired,
  dispatchAction: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  popupData: PropTypes.shape({
    cancelButtonText: PropTypes.string,
    clearData: PropTypes.string,
    confirmButtonText: PropTypes.string,
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    message: PropTypes.string,
    onConfirm: PropTypes.func,
    showCancelButton: PropTypes.bool,
    showConfirmButton: PropTypes.bool,
    title: PropTypes.string,
  }).isRequired,

};

const mapStateToProps = state => ({
  popupData: dashboardSelectors.getPopupData(state),
});

const mapDispatchToProps = dispatch => ({
  fetchData: widgetsOperation.fetchWestWingFrobRepayDataOperation(dispatch),
  dispatchAction: dashboardOperations.dispatchAction(dispatch),
  clearPopupData: dashboardOperations.clearPopupData(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(WestWingPage);
