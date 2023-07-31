import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import './SkillHistoryDialog.css';
import * as R from 'ramda';
import {
  selectors as userSkillsSelectors,
  operations as userSkillsOperations,
} from 'ducks/user-skills';

class SkillHistoryDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  dateFormatter = (date) => {
    if (R.isNil(date)) { return ''; }
    const year = date.slice(0, 4);
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);
    return (`${month}/${day}/${year}`);
  }

  handleSkillHistoryDialogClose() {
    const { setSkillHistoryDialog } = this.props;

    setSkillHistoryDialog(false);
  }

  render() {
    const { skillDesc, skillHistory, skillHistoryDialog } = this.props;

    return (
      <>
        <Dialog maxWidth="xl" onClose={() => { this.handleSkillHistoryDialogClose(); }} open={skillHistoryDialog}>
          <DialogTitle>
            Skill History
            <br />
            {skillDesc}
          </DialogTitle>
          <Divider />
          <DialogContent styleName="dialog-content">
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Updated Date</TableCell>
                  <TableCell>Updated By</TableCell>
                  <TableCell>Get Next</TableCell>
                  <TableCell>QC Required</TableCell>
                  <TableCell>Breached Indicator</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Enable Flag</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  skillHistory.length > 0 && skillHistory.map(value => (
                    <TableRow key={`${value.userSkillId}-${value.updateDateTime}`}>
                      <TableCell>{this.dateFormatter(value.updateDateTime)}</TableCell>
                      <TableCell>{value.updateBy}</TableCell>
                      <TableCell>
                        <Switch checked={(value.getNext === 1)} size="small" />
                      </TableCell>
                      <TableCell>
                        <Switch checked={(value.qcRequired === 1)} size="small" />
                      </TableCell>
                      <TableCell>
                        <Switch checked={(value.breachedIndicator === 1)} size="small" />
                      </TableCell>
                      <TableCell>
                        <Switch checked={(value.priority === 1)} size="small" />
                      </TableCell>
                      <TableCell>
                        <Switch checked={(value.enableFlag === 'Y')} size="small" />
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

SkillHistoryDialog.defaultProps = {
  skillDesc: '',
  skillHistory: [],
};

SkillHistoryDialog.propTypes = {
  setSkillHistoryDialog: PropTypes.func.isRequired,
  skillDesc: PropTypes.string,
  skillHistory: PropTypes.arrayOf(
    PropTypes.shape({
      updateBy: PropTypes.string.isRequired,
      userSkillId: PropTypes.number.isRequired,
    }),
  ),
  skillHistoryDialog: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  skillDesc: userSkillsSelectors.getSkillDesc(state),
  skillHistory: userSkillsSelectors.getSkillHistory(state),
  skillHistoryDialog: userSkillsSelectors.getSkillHistoryDialog(state),
});


const mapDispatchToProps = dispatch => ({
  setSkillHistoryDialog: userSkillsOperations.setSkillHistoryDialogOperation(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(SkillHistoryDialog);
