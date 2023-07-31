import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Typography } from '@material-ui/core/index';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import './AddSkillsDialog.css';
import * as R from 'ramda';
import {
  selectors as userSkillsSelectors,
  operations as userSkillsOperations,
} from 'ducks/user-skills';

class AddSkillsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSkills: [],
      skillSearchText: '',
    };
  }

  onSkillSearchTextChange(skill) {
    this.setState({ skillSearchText: skill.target.value });
  }

  onSelectSkill(e, skillInfo) {
    const { selectedSkills } = this.state;
    const { checkSkills } = this.props;

    checkSkills({ count: 'ONE', identifier: skillInfo.skillId, value: e.target.checked });

    if (e.target.checked === true) {
      this.setState({ selectedSkills: [...selectedSkills, skillInfo] });
    } else {
      const filteredSkills = selectedSkills.filter(record => record.skillId !== skillInfo.skillId);

      this.setState({ selectedSkills: filteredSkills });
    }
  }

  onSelectAllSkills(e) {
    const { skills, checkSkills } = this.props;

    checkSkills({ count: 'ALL', value: e.target.checked });

    if (e.target.checked === true) {
      this.setState({ selectedSkills: skills.map(record => ({ ...record })) });
    } else {
      this.setState({ selectedSkills: [] });
    }
  }

  handleAddSkillDialogClose() {
    const { setAddSkillDialog, checkSkills } = this.props;

    checkSkills({ count: 'ALL', value: false });

    this.setState({ selectedSkills: [] });

    setAddSkillDialog(false);
  }

  addRow() {
    const {
      addUserSkills,
      setAddSkillBtn,
      setClearSaveBtn,
      setAddSkillDialog,
    } = this.props;

    const { selectedSkills } = this.state;

    addUserSkills(selectedSkills);

    setAddSkillBtn(false);
    setClearSaveBtn(true);

    this.setState({ selectedSkills: [] });

    setAddSkillDialog(false);
  }

  render() {
    const { selectedSkills, skillSearchText } = this.state;
    const { skills, addSkillDialog } = this.props;

    return (
      <>
        <Dialog onClose={() => { this.handleAddSkillDialogClose(); }} open={addSkillDialog}>
          <DialogTitle>
            Skills
            <br />
            <TextField
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton aria-label="search" size="small" type="button">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => { this.onSkillSearchTextChange(e); }}
              onKeyPress={() => {}}
              placeholder="Search skills..."
              styleName="searchStyle"
              value={skillSearchText}
              varirant="filled"
            />

            <Typography styleName="typography" variant="h6">
              {`${selectedSkills.length} Skill(s) selected of ${skills.length}`}
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent styleName="dialog-content">
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="left" styleName="table-cell">
                    <Checkbox
                      onChange={(e) => { this.onSelectAllSkills(e); }}
                      styleName="checkbox"
                    />
                  </TableCell>
                  <TableCell>Skill ID</TableCell>
                  <TableCell>Skill Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  skills.length > 0 && skills.map(value => (
                    <TableRow
                      key={value.skillId}
                      style={{
                        display: R.pathOr('', ['skillDesc'], value).toLowerCase().search(
                          skillSearchText.toLowerCase(),
                        ) !== -1 ? '' : 'none',
                      }}
                    >
                      <TableCell align="left" styleName="table-cell">
                        <Checkbox
                          checked={value.isChecked}
                          onChange={(e) => { this.onSelectSkill(e, value); }}
                          styleName="checkbox"
                        />
                      </TableCell>
                      <TableCell>{value.skillName}</TableCell>
                      <TableCell>{value.skillDesc}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </DialogContent>

          <DialogActions>
            <Button
              color="primary"
              onClick={() => { this.addRow(); }}
              size="small"
              variant="contained"
            >
              ADD
            </Button>

            &nbsp;&nbsp;&nbsp;

            <Button
              color="primary"
              onClick={() => { this.handleAddSkillDialogClose(); }}
              size="small"
              variant="outlined"
            >
              CANCEL
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

AddSkillsDialog.defaultProps = {
  skills: [],
};

AddSkillsDialog.propTypes = {
  addSkillDialog: PropTypes.bool.isRequired,
  addUserSkills: PropTypes.func.isRequired,
  checkSkills: PropTypes.func.isRequired,
  setAddSkillBtn: PropTypes.func.isRequired,
  setAddSkillDialog: PropTypes.func.isRequired,
  setClearSaveBtn: PropTypes.func.isRequired,
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      eventName: PropTypes.string.isRequired,
      skillDesc: PropTypes.string.isRequired,
      skillId: PropTypes.number.isRequired,
      skillName: PropTypes.string.isRequired,
    }),
  ),
};

const mapStateToProps = state => ({
  addSkillDialog: userSkillsSelectors.getAddSkillDialog(state),
  skills: userSkillsSelectors.getSkills(state),
});


const mapDispatchToProps = dispatch => ({
  addUserSkills: userSkillsOperations.addUserSkillsOperation(dispatch),
  checkSkills: userSkillsOperations.checkSkillsOperation(dispatch),
  setAddSkillBtn: userSkillsOperations.setAddSkillBtnOperation(dispatch),
  setAddSkillDialog: userSkillsOperations.setAddSkillDialogOperation(dispatch),
  setClearSaveBtn: userSkillsOperations.setClearSaveBtnOperation(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(AddSkillsDialog);
