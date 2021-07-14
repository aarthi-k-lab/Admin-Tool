/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import './TimelineItem.css';
import moment from 'moment-timezone';
import Grid from '@material-ui/core/Grid';
import * as R from 'ramda';
import { connect } from 'react-redux';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { operations as milestoneOperations, selectors as milestoneSelector } from 'ducks/milestone-activity';
import TimelineSubItem from './TimelineSubItem';
import { ALL_MILESTONE_HISTORY, CLOSED, INTERRUPTED } from '../../../../constants/auditView';


const getCSTDateTime = dateTime => (R.isNil(dateTime) ? '-' : moment(dateTime).tz('America/Chicago').format('MM/DD/YYYY hh:mm A'));
class TimelineItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(mlstnNm) {
    const { isOpen } = this.state;
    const {
      getTaskDetails, getStagerTasks, taskData, prcsId, handleTimelineClick,
    } = this.props;
    handleTimelineClick(taskData.taskId);
    getTaskDetails(mlstnNm);
    if (R.contains('STAGER', R.toUpper(mlstnNm)) || (R.equals('Post Mod', mlstnNm))) {
      getStagerTasks({
        mlstnNm: taskData.mlstnNm,
        minCreDttm: taskData.creDttm,
        maxDttm: taskData.currStsDttm,
        prcsId,
        isOpen,
      });
      this.setState({ isOpen: !isOpen });
    }
  }


  render() {
    const {
      taskData, stagerTasks, active, mlstnName,
    } = this.props;
    const { isOpen } = this.state;
    const assignUserName = taskData.asgnUsrNm.lastIndexOf('@') !== -1
      ? taskData.asgnUsrNm.substring(0, taskData.asgnUsrNm.lastIndexOf('@')) : taskData.asgnUsrNm;
    return (
      <>
        <div onClick={() => this.handleClick(taskData.mlstnNm)} styleName="timeline-item">
          <div styleName={active && mlstnName !== ALL_MILESTONE_HISTORY ? 'timeline-item-content selected-item' : 'timeline-item-content'}>
            <Grid container styleName="main-container">
              <Grid item xs={2}>
                <AccountCircleIcon />
              </Grid>
              <Grid item styleName="user-detail" xs={6}>
                <span styleName="value-style">{taskData.mlstnNm}</span>
                <br />
                <span styleName="resolutionChoiceType">{assignUserName}</span>
              </Grid>
              <Grid item styleName="user-detail" xs={4}>
                <div styleName={R.contains(R.propOr('N/A', 'currSts', taskData), ['Rejected', 'Failed', 'Interrupted']) ? 'failedStatus' : 'successStatus'}>{taskData.currSts}</div>
                <div>
                  <span>
                    {
                      taskData.currSts === CLOSED || taskData.currSts === INTERRUPTED
                        ? `IN ${moment(taskData.currStsDttm).diff(moment(taskData.creDttm), 'days')} DAYS`
                        : `IN ${moment().diff(moment(taskData.creDttm), 'days')} DAYS`
                    }
                  </span>
                </div>
              </Grid>
            </Grid>
            <Grid item styleName="right-item">
              <Grid alignItems="center" container direction="row" justify="flex-start" spacing={1}>
                <Grid item styleName="dateStyle" xs={4}>
                  <span styleName="value-style">START DATE</span>
                  <br />
                  <span styleName="header-style">{getCSTDateTime(taskData.creDttm)}</span>
                </Grid>
                <Grid item styleName="dateStyle" xs={4}>
                  <span styleName="value-style">END DATE</span>
                  <br />
                  <span styleName="header-style">
                    {
                      taskData.currSts === CLOSED
                        ? getCSTDateTime(taskData.currStsDttm)
                        : '-'
                    }
                  </span>
                </Grid>
                <Grid item styleName="dateStyle" xs={4}>
                  <span styleName="value-style">ASSIGNED DATE</span>
                  <br />
                  <span styleName="header-style">
                    {' '}
                    {getCSTDateTime(taskData.dueDttm)}
                  </span>
                </Grid>
              </Grid>
            </Grid>

            <span styleName="circle" />
          </div>
          <div />
        </div>

        {isOpen && !R.isNil(stagerTasks)
          && (
            <div styleName="timeline-container-inner">
              {' '}
              {stagerTasks[`${taskData.creDttm}+${taskData.currStsDttm}`] && stagerTasks[`${taskData.creDttm}+${taskData.currStsDttm}`].map(data => (
                <TimelineSubItem key={data.disName} grpData={data} />
              ))}
            </div>
          )
        }
      </>
    );
  }
}

const TestExports = {
  TimelineItem,
};

const mapDispatchToProps = dispatch => ({
  getTaskDetails: milestoneOperations.getTaskDetailsByTaskNm(dispatch),
  getStagerTasks: milestoneOperations.getStagerTasksByDttm(dispatch),
});

TimelineItem.propTypes = {
  active: PropTypes.bool.isRequired,
  getStagerTasks: PropTypes.func.isRequired,
  getTaskDetails: PropTypes.func.isRequired,
  handleTimelineClick: PropTypes.func.isRequired,
  mlstnName: PropTypes.string.isRequired,
  prcsId: PropTypes.string.isRequired,
  stagerTasks: PropTypes.shape({
  }).isRequired,
  taskData: PropTypes.shape({
    asgnDttm: PropTypes.string,
    asgnUsrNm: PropTypes.string,
    creDttm: PropTypes.string,
    currSts: PropTypes.string,
    currStsDttm: PropTypes.string,
    dueDttm: PropTypes.string,
    mlstnNm: PropTypes.string,
    taskId: PropTypes.string,
    taskName: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  stagerTasks: milestoneSelector.getStagerTasksData(state),
  mlstnName: milestoneSelector.getMlstnName(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimelineItem);
export { TestExports };
