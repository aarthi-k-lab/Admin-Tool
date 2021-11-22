import React from 'react';
import ReactTable from 'react-table';
import { ERROR } from 'constants/common';
import { withRouter } from 'react-router-dom';
import { selectors, operations } from 'ducks/dashboard';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';

import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';

import './MoveForward.css';
import Messages from '../../models/Dashboard/Messages';
import UserNotification from '../../components/UserNotification/UserNotification';
import {
  MOVE_FORWARD, TASK_NAMES, TABLE_COLUMN,
} from '../../constants/moveForward';


const validEvalEntries = RegExp(/[a-zA-Z]|[~`(@!#$%^&*+._)=\-[\]\\';/{}|\\":<>?]/);
const validateEvalFormat = (evalIds) => {
  let isValid = true;
  if (validEvalEntries.test(evalIds)) {
    isValid = false;
  }
  return isValid;
};
class MoveForward extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      evalIds: '',
      dropdownValue: '',
      isDisabled: true,
    };
    this.renderNotepadArea = this.renderNotepadArea.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.handleEvalIdSubmit = this.handleEvalIdSubmit.bind(this);
    this.getMessage = this.getMessage.bind(this);
    this.renderDropdown = this.renderDropdown.bind(this);
    this.renderTableData = this.renderTableData.bind(this);
  }

  onValueChange(event) {
    this.setState({ dropdownValue: event.target.value });
  }

  getMessage() {
    let count = 0;
    const { evalStatus } = this.props;
    const data = Object.assign([], R.flatten(evalStatus));
    const successRecords = R.filter(obj => obj.status === 'Successful', data);
    count = R.uniq(successRecords.map(o => o.evalId)).length;
    return `${count} evalId have been processed.`;
  }

  handleChange(event) {
    this.setState({
      evalIds: event.target.value,
      isDisabled: false,
    });
  }

  handleEvalIdSubmit() {
    const { evalIds, dropdownValue } = this.state;
    const { onFailedEvalValidation, onEvalSubmit } = this.props;
    const {
      MSG_INVALID_TASKNAME, MSG_LIMIT_EXCEED, MSG_NULL_REQUEST, MSG_VALIDATION_FAILED,
    } = Messages;
    if (validateEvalFormat(evalIds)) {
      const evalId = evalIds.trim().replace(/\n/g, ',').split(',').map(s => s.trim())
        .filter(s => s.length > 0);
      const evalIdList = new Set(evalId);
      if (evalIdList.size > 50) {
        const payload = {
          level: ERROR,
          status: MSG_LIMIT_EXCEED,
        };
        onFailedEvalValidation(payload);
      } else if (evalIdList.size < 1) {
        const payload = {
          level: ERROR,
          status: MSG_NULL_REQUEST,
        };
        onFailedEvalValidation(payload);
      } else if (!R.isEmpty(dropdownValue) && !R.isNil(dropdownValue)) {
        const payload = {
          evalId: [...evalId],
          taskName: dropdownValue,
        };
        onEvalSubmit(payload);
      } else {
        const payload = {
          level: ERROR,
          status: MSG_INVALID_TASKNAME,
        };
        onFailedEvalValidation(payload);
      }
    } else {
      const payload = {
        level: ERROR,
        status: MSG_VALIDATION_FAILED,
      };
      onFailedEvalValidation(payload);
    }
  }

  renderDropdown() {
    const { dropdownValue } = this.state;
    return (
      <div>
        <Grid>
          <Select
            onChange={event => this.onValueChange(event)}
            styleName="drop-down-select"
            value={dropdownValue}
          >
            {TASK_NAMES.map(item => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </Select>
        </Grid>
      </div>
    );
  }

  renderNotepadArea() {
    const { evalIds, isDisabled } = this.state;
    return (
      <div styleName="status-details-parent">
        <div styleName="status-details">
          <TextField
            margin="normal"
            multiline
            onChange={this.handleChange}
            styleName="text-field"
            value={evalIds}
          />
        </div>
        <div styleName="interactive-button">
          <Button
            className="material-ui-button"
            color="primary"
            disabled={isDisabled}
            margin="normal"
            onClick={this.handleEvalIdSubmit}
            variant="contained"
          >
            SUBMIT
          </Button>
        </div>
      </div>
    );
  }

  renderTableData() {
    const { evalStatus } = this.props;
    return (
      <div styleName="table-container">
        <div styleName="height-limiter">
          <ReactTable
            className="-striped -highlight"
            columns={TABLE_COLUMN}
            data={R.flatten(evalStatus) || []}
            defaultPageSize={50}

            getTrProps={(state, rowInfo) => ({
              style: { background: !rowInfo || rowInfo.row.status === 'Successful' ? '' : '#ffe1e1' },
            })}
            pageSizeOptions={[10, 20, 25, 50, 100]}
            styleName="table"
          />
        </div>
      </div>
    );
  }

  render() {
    const { resultOperation } = this.props;

    return (

      <>
        <Grid container>
          <Grid>
            <div styleName="investorLabel">
              {MOVE_FORWARD}
            </div>
          </Grid>
          <Grid item xs={3}>
            {this.renderDropdown()}
          </Grid>
          <Grid item xs={4}>
            <div styleName="title-row">
              {(resultOperation && resultOperation.status)
                ? <UserNotification level={resultOperation.level} message={resultOperation.status} type="alert-box" />
                : ''}
            </div>
          </Grid>
        </Grid>
        <>
          <Grid container>
            <Grid item xs={6}>
              <span styleName="eval-Ids">Enter Eval Ids</span>
            </Grid>
            <Grid item xs={5}>
              <span styleName="message">
                {this.getMessage()}
              </span>
            </Grid>
          </Grid>
          <Grid container styleName="eval-activity">
            <Grid item xs={2}>
              {this.renderNotepadArea()}
            </Grid>
            <Grid direction="column" item xs={10}>
              {this.renderTableData()}
            </Grid>
          </Grid>
        </>
      </>
    );
  }
}
MoveForward.defaultProps = {
  onFailedEvalValidation: () => { },
  resultOperation: { level: '', status: '' },
  onEvalSubmit: () => { },
  evalStatus: [
    {
      evalId: '', status: '',
    },
  ],
};

MoveForward.propTypes = {
  evalStatus: PropTypes.arrayOf(
    PropTypes.shape({
      evalId: PropTypes.string,
      status: PropTypes.string,
    }),
  ),
  onEvalSubmit: PropTypes.func,
  onFailedEvalValidation: PropTypes.func,
  resultOperation: PropTypes.shape({
    level: PropTypes.string,
    status: PropTypes.string,
  }),
};

const mapStateToProps = state => ({
  resultOperation: selectors.resultOperation(state),
  evalStatus: selectors.getEvalStatus(state),
});

const mapDispatchToProps = dispatch => ({
  onEvalSubmit: operations.onEvalSubmit(dispatch),
  onFailedEvalValidation: operations.onFailedEvalValidation(dispatch),
});

const MoveForwardContainer = connect(mapStateToProps, mapDispatchToProps)(MoveForward);

const TestHooks = {
  MoveForward,
};

export default withRouter(MoveForwardContainer);

export { TestHooks };
