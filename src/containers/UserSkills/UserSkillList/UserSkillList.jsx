import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SectionHeader from 'containers/UserSkills/SectionHeader';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import HistoryIcon from '@material-ui/icons/History';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import './UserSkillList.css';
import * as R from 'ramda';
import {
  selectors as userSkillsSelectors,
  operations as userSkillsOperations,
} from 'ducks/user-skills';
import AddSkillsDialog from './AddSkillsDialog/AddSkillsDialog';
import SkillHistoryDialog from './SkillHistoryDialog/SkillHistoryDialog';

class UserSkillList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alertSkillAdd: false,
      sortOrder: 'ascend',
      selectedUserSkills: [],
      checkAllUserSkillsBtn: false,
    };
    this.title = 'Assigned Skills';
    this.skillListStyle = props.style;
    this.sectionHeaderStyle = { paddingTop: 15, paddingLeft: 15 };

    this.handleEnable = this.handleEnable.bind(this);
    this.handleAddSkillDialogOpen = this.handleAddSkillDialogOpen.bind(this);
    this.handleSkillHistoryDialogOpen = this.handleSkillHistoryDialogOpen.bind(this);
  }

  onSelectUserSkill(e, userSkillInfo) {
    const { selectedUserSkills } = this.state;
    const { checkUserSkills } = this.props;

    checkUserSkills({ count: 'ONE', identifier: userSkillInfo.userSkillId, value: e.target.checked });

    if (e.target.checked === true) {
      this.setState({ selectedUserSkills: [...selectedUserSkills, userSkillInfo] });
    } else {
      const filteredUserSkills = selectedUserSkills.filter(
        record => record.userSkillId !== userSkillInfo.userSkillId,
      );

      this.setState({ selectedUserSkills: filteredUserSkills });
    }
  }

  onSelectAllUserSkills(e) {
    const { userSkills, checkUserSkills } = this.props;

    this.setState({ checkAllUserSkillsBtn: e.target.checked });

    checkUserSkills({ count: 'ALL', value: e.target.checked });

    if (e.target.checked === true) {
      this.setState({ selectedUserSkills: userSkills.map(record => ({ ...record })) });
    } else {
      this.setState({ selectedUserSkills: [] });
    }
  }

  getSkillDesc(skillId) {
    const { skills } = this.props;
    const skill = R.find(R.propEq('skillId', skillId))(skills);
    return skill !== undefined ? skill.skillDesc : '';
  }

  handleAlertSkillAddClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ alertSkillAdd: false });
  }

  handleEnable(type) {
    const { selectedUserSkills } = this.state;
    const {
      checkUserSkills,
      enableUserSkills,
      setAddSkillBtn,
      setClearSaveBtn,
    } = this.props;

    checkUserSkills({ count: 'ALL', value: false });
    enableUserSkills({ value: type === 'ENABLE' ? 1 : 0, selectedUserSkills });

    this.setState({ checkAllUserSkillsBtn: false });
    this.setState({ selectedUserSkills: [] });

    setAddSkillBtn(false);
    setClearSaveBtn(true);
  }

  handleAddSkillDialogOpen() {
    const { setAddSkillDialog } = this.props;

    setAddSkillDialog(true);
  }

  handleSkillHistoryDialogOpen(e, userSkillId) {
    const { fetchSkillHistory, setSkillHistoryDialog } = this.props;

    fetchSkillHistory(userSkillId);

    setSkillHistoryDialog(true);
  }

  updateRow(e, userSkillId) {
    const {
      updateUserSkills,
      setAddSkillBtn,
      setClearSaveBtn,
      isEditEnabled,
    } = this.props;

    if (isEditEnabled) {
      const key = e.target.name;
      let value;
      if (key !== 'enableFlag') {
        value = e.target.checked === true ? 1 : 0;
      } else {
        value = e.target.checked === true ? 'Y' : 'N';
      }

      updateUserSkills({ key, value, identifier: userSkillId });

      setAddSkillBtn(false);
      setClearSaveBtn(true);
    }
  }

  sortData(e, columnName) {
    const { sortUserSkills } = this.props;

    const { sortOrder } = this.state;

    sortUserSkills({ order: sortOrder, columnName });

    this.setState({ sortOrder: sortOrder === 'ascend' ? 'descend' : 'ascend' });
  }

  clearUpdate() {
    const { clearUpdateUserSkills, setAddSkillBtn, setClearSaveBtn } = this.props;

    this.setState({ checkAllUserSkillsBtn: false });

    clearUpdateUserSkills();

    setAddSkillBtn(true);
    setClearSaveBtn(false);
  }

  saveUpdate() {
    const {
      setAddSkillBtn,
      setClearSaveBtn,
      saveUpdateUserSkills,
    } = this.props;

    this.setState({ alertSkillAdd: true });
    this.setState({ checkAllUserSkillsBtn: false });

    saveUpdateUserSkills();

    setAddSkillBtn(true);
    setClearSaveBtn(false);
  }

  render() {
    const {
      event,
      userSkills,
      addSkillBtn,
      clearSaveBtn,
      isEditEnabled,
    } = this.props;

    const {
      alertSkillAdd,
      checkAllUserSkillsBtn,
    } = this.state;

    return (
      <div style={this.skillListStyle}>
        <SectionHeader style={this.sectionHeaderStyle} title={this.title} />

        <div
          style={{ display: addSkillBtn && isEditEnabled ? '' : 'none' }}
          styleName="align-btns"
        >
          <Button
            color="primary"
            onClick={this.handleAddSkillDialogOpen}
            size="small"
            variant="contained"
          >
              + ADD SKILL
          </Button>

          &nbsp;&nbsp;&nbsp;

          <Button
            color="secondary"
            onClick={() => { this.handleEnable('ENABLE'); }}
            size="small"
            variant="outlined"
          >
              ENABLE
          </Button>

          &nbsp;&nbsp;&nbsp;

          <Button
            color="secondary"
            onClick={() => { this.handleEnable('DISABLE'); }}
            size="small"
            variant="outlined"
          >
              DISABLE
          </Button>
        </div>

        <div
          style={{ display: clearSaveBtn && isEditEnabled ? '' : 'none' }}
          styleName="align-btns"
        >
          <Button
            color="primary"
            onClick={() => { this.clearUpdate(); }}
            size="small"
            variant="outlined"
          >
              CLEAR
          </Button>

          &nbsp;&nbsp;&nbsp;

          <Button
            color="primary"
            onClick={() => { this.saveUpdate(); }}
            size="small"
            variant="contained"
          >
              SAVE
          </Button>
        </div>

        <Box style={{ display: (userSkills.length !== 0) ? '' : 'none' }}>
          <TableContainer
            component={Paper}
            elevation={0}
            styleName="table-container"
          >

            <Table aria-label="simple table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="left" style={{ minWidth: 30 }} styleName="table-cell">
                    <Checkbox
                      checked={checkAllUserSkillsBtn}
                      onChange={(e) => { this.onSelectAllUserSkills(e); }}
                      styleName="checkbox"
                    />
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: 130 }} styleName="table-cell">
                    Skill
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: 90 }} styleName="table-cell">
                    Get Next

                    <img
                      alt="Sort"
                      onClick={(e) => { this.sortData(e, 'getNext'); }}
                      role="presentation"
                      src="/static/img/sort.svg"
                      styleName="sort-img"
                    />
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: 110 }} styleName="table-cell">
                    QC Required

                    <img
                      alt="Sort"
                      onClick={(e) => { this.sortData(e, 'qcRequired'); }}
                      role="presentation"
                      src="/static/img/sort.svg"
                      styleName="sort-img"
                    />
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: 140 }} styleName="table-cell">
                    Breached Indicator

                    <img
                      alt="Sort"
                      onClick={(e) => { this.sortData(e, 'breachedIndicator'); }}
                      role="presentation"
                      src="/static/img/sort.svg"
                      styleName="sort-img"
                    />
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: 90 }} styleName="table-cell">
                    Priority

                    <img
                      alt="Sort"
                      onClick={(e) => { this.sortData(e, 'priority'); }}
                      role="presentation"
                      src="/static/img/sort.svg"
                      styleName="sort-img"
                    />
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: 110 }} styleName="table-cell">
                    Enable Flag

                    <img
                      alt="Sort"
                      onClick={(e) => { this.sortData(e, 'enableFlag'); }}
                      role="presentation"
                      src="/static/img/sort.svg"
                      styleName="sort-img"
                    />
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: 40 }} styleName="table-cell" />
                </TableRow>
              </TableHead>

              <TableBody>
                {
                  userSkills.length > 0 && userSkills.map(value => (
                    <TableRow key={value.userSkillId}>
                      <TableCell align="left">
                        <Checkbox
                          checked={value.isChecked}
                          onChange={(e) => { this.onSelectUserSkill(e, value); }}
                          styleName="checkbox"
                        />
                      </TableCell>
                      <TableCell align="left">{this.getSkillDesc(value.skillId)}</TableCell>
                      <TableCell align="left">
                        <Switch checked={(value.getNext === 1)} name="getNext" onChange={(e) => { this.updateRow(e, value.userSkillId); }} size="small" />
                      </TableCell>
                      <TableCell align="left">
                        <Switch checked={(value.qcRequired === 1)} name="qcRequired" onChange={(e) => { this.updateRow(e, value.userSkillId); }} size="small" />
                      </TableCell>
                      <TableCell align="left">
                        <Switch checked={(value.breachedIndicator === 1)} name="breachedIndicator" onChange={(e) => { this.updateRow(e, value.userSkillId); }} size="small" />
                      </TableCell>
                      <TableCell align="left">
                        <Switch checked={(value.priority === 1)} name="priority" onChange={(e) => { this.updateRow(e, value.userSkillId); }} size="small" />
                      </TableCell>
                      <TableCell align="left">
                        <Switch checked={(value.enableFlag === 'Y')} name="enableFlag" onChange={(e) => { this.updateRow(e, value.userSkillId); }} size="small" />
                      </TableCell>
                      <TableCell align="left">
                        <HistoryIcon onClick={(e) => { this.handleSkillHistoryDialogOpen(e, value.userSkillId); }} style={{ cursor: 'pointer', display: isEditEnabled ? '' : 'none' }} />
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Snackbar
          autoHideDuration={6000}
          onClose={this.handleAlertSkillAddClose}
          open={alertSkillAdd}
        >
          <Alert elevation={6} onClose={this.handleAlertSkillAddClose} severity="success">
            Skill(s) Updated Successfully !!!
          </Alert>
        </Snackbar>

        <Snackbar
          open={JSON.stringify(event) !== '{}' && userSkills.length === 0}
        >
          <Alert elevation={6} severity="info">
            No Skill(s) found !!!
          </Alert>
        </Snackbar>

        <AddSkillsDialog />

        <SkillHistoryDialog />

      </div>
    );
  }
}

UserSkillList.defaultProps = {
  event: {},
  skills: [],
  style: {},
  userSkills: [],
};

UserSkillList.propTypes = {
  addSkillBtn: PropTypes.bool.isRequired,
  checkUserSkills: PropTypes.func.isRequired,
  clearSaveBtn: PropTypes.bool.isRequired,
  clearUpdateUserSkills: PropTypes.func.isRequired,
  enableUserSkills: PropTypes.func.isRequired,
  event: PropTypes.shape({
    eventName: PropTypes.string,
  }),
  fetchSkillHistory: PropTypes.func.isRequired,
  isEditEnabled: PropTypes.bool.isRequired,
  saveUpdateUserSkills: PropTypes.func.isRequired,
  setAddSkillBtn: PropTypes.func.isRequired,
  setAddSkillDialog: PropTypes.bool.isRequired,
  setClearSaveBtn: PropTypes.func.isRequired,
  setSkillHistoryDialog: PropTypes.bool.isRequired,
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      eventName: PropTypes.string.isRequired,
      skillDesc: PropTypes.string.isRequired,
      skillId: PropTypes.number.isRequired,
      skillName: PropTypes.string.isRequired,
    }),
  ),
  sortUserSkills: PropTypes.func.isRequired,
  style: PropTypes.shape({

  }),
  updateUserSkills: PropTypes.func.isRequired,
  userSkills: PropTypes.arrayOf(
    PropTypes.shape({
      breachedIndicator: PropTypes.number.isRequired,
      emailAddr: PropTypes.string,
      getNext: PropTypes.number.isRequired,
      priority: PropTypes.number.isRequired,
      qcRequired: PropTypes.number.isRequired,
      skillId: PropTypes.number.isRequired,
      userSkillId: PropTypes.number.isRequired,
    }),
  ),
};

const mapStateToProps = state => ({
  userSkills: userSkillsSelectors.getUserSkills(state),
  event: userSkillsSelectors.getSelectedEvent(state),
  skills: userSkillsSelectors.getSkills(state),
  addSkillBtn: userSkillsSelectors.getAddSkillBtn(state),
  clearSaveBtn: userSkillsSelectors.getClearSaveBtn(state),
  isEditEnabled: userSkillsSelectors.getIsEditEnabled(state),
});

const mapDispatchToProps = dispatch => ({
  checkSkills: userSkillsOperations.checkSkillsOperation(dispatch),
  checkUserSkills: userSkillsOperations.checkUserSkillsOperation(dispatch),
  updateUserSkills: userSkillsOperations.updateUserSkillsOperation(dispatch),
  sortUserSkills: userSkillsOperations.sortUserSkillsOperation(dispatch),
  clearUpdateUserSkills: userSkillsOperations.clearUpdateUserSkillsOperation(dispatch),
  saveUpdateUserSkills: userSkillsOperations.saveUpdateUserSkillsOperation(dispatch),
  enableUserSkills: userSkillsOperations.enableUserSkillsOperation(dispatch),
  fetchSkillHistory: userSkillsOperations.fetchSkillHistoryOperation(dispatch),
  setAddSkillBtn: userSkillsOperations.setAddSkillBtnOperation(dispatch),
  setClearSaveBtn: userSkillsOperations.setClearSaveBtnOperation(dispatch),
  setAddSkillDialog: userSkillsOperations.setAddSkillDialogOperation(dispatch),
  setSkillHistoryDialog: userSkillsOperations.setSkillHistoryDialogOperation(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(UserSkillList);
