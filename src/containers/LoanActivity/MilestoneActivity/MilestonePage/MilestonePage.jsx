import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Tombstone from 'containers/Dashboard/Tombstone';
import ContentHeader from 'components/ContentHeader';
import HistoryIcon from '@material-ui/icons/History';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import './MilestonePage.css';
import { connect } from 'react-redux';
import { operations as milestoneOperations } from 'ducks/milestone-activity';
import Typography from '@material-ui/core/Typography';
import CenterPane from '../CenterPane';
import Timeline from '../Timeline';
import WidgetBuilder from '../../../../components/Widgets/WidgetBuilder';
import { ALL_MILESTONE_HISTORY, CLOSED } from '../../../../constants/auditView';


class MilestonePage extends React.PureComponent {
  handleClick(mlstnNm) {
    const { getTaskDetails } = this.props;
    getTaskDetails(mlstnNm);
  }

  render() {
    const {
      groupTask,
      inProgress,
      onClickMilestone,
      onStagerTaskClick,
      prcsId,
      inSearchPage,
    } = this.props;
    const title = 'WORKFLOW ACTIVITY';
    const groupTaskData = groupTask && R.sort(R.descend(R.prop('maxCurrStsDttm')), groupTask);
    const processStatus = () => {
      if (groupTaskData && groupTaskData.length) {
        return R.propOr('', 'currSts', R.head(groupTaskData)) === CLOSED ? 'CLOSED' : R.toUpper(R.propOr('', 'mlstnNm', R.head(groupTaskData)));
      }
      return '';
    };
    return (
      <>
        {inSearchPage && <ContentHeader title={title} />}
        {inSearchPage && <Tombstone />}
        <Grid container styleName="loan-activity">
          <Grid item styleName="status-details-parent" xs={3}>
            <div styleName="page-header">
              <span>Current Status: </span>
              <span styleName="process-status">{processStatus()}</span>
              <Tooltip
                placement="right-end"
                title={(
                  <Typography>
                    {ALL_MILESTONE_HISTORY}
                  </Typography>
                )}
              >
                <IconButton onClick={() => this.handleClick(ALL_MILESTONE_HISTORY)}>
                  <HistoryIcon />
                </IconButton>
              </Tooltip>
            </div>
            <div styleName="status-details">
              <Timeline
                groupTaskData={groupTaskData}
                inProgress={inProgress}
                onClickMilestone={onClickMilestone}
                onStagerTaskClick={onStagerTaskClick}
                prcsId={prcsId}
                processStatus={processStatus()}
              />
            </div>
            {inSearchPage && (
              <div styleName="postion">
                <WidgetBuilder page="MLSTN_PAGE" />
              </div>
            )}
          </Grid>
          <Grid item xs={9}>
            <div styleName="centerpane">
              <CenterPane />
            </div>
          </Grid>
        </Grid>
      </>
    );
  }
}

const TestExports = {
  MilestonePage,
};

MilestonePage.defaultProps = {
  inProgress: true,
  inSearchPage: false,
};

const mapDispatchToProps = dispatch => ({
  getTaskDetails: milestoneOperations.getTaskDetailsByTaskNm(dispatch),
  getStagerTasks: milestoneOperations.getStagerTasksByDttm(dispatch),
});

MilestonePage.propTypes = {
  getTaskDetails: PropTypes.func.isRequired,
  groupTask: PropTypes.arrayOf(
    PropTypes.shape({
      asgnDttm: PropTypes.string,
      asgnUsrNm: PropTypes.string,
      creDttm: PropTypes.string,
      currSts: PropTypes.string,
      currStsDttm: PropTypes.string,
      dueDttm: PropTypes.string,
      mlstnNm: PropTypes.string,
      taskId: PropTypes.string,
      taskName: PropTypes.string,
    }),
  ).isRequired,
  inProgress: PropTypes.bool,
  inSearchPage: PropTypes.bool,
  onClickMilestone: PropTypes.func.isRequired,
  onStagerTaskClick: PropTypes.func.isRequired,
  prcsId: PropTypes.string.isRequired,
};

export default connect(null, mapDispatchToProps)(MilestonePage);

export { TestExports };
