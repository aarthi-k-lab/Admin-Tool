import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Tombstone from 'containers/Dashboard/Tombstone';
import ContentHeader from 'components/ContentHeader';
import Timeline from '../Timeline';
import CenterPane from '../CenterPane';
import './MilestonePage.css';
import WidgetBuilder from '../../../../components/Widgets/WidgetBuilder';

class MilestonePage extends React.PureComponent {
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
        return groupTaskData[0].currSts === 'Closed' ? 'CLOSED' : R.toUpper(groupTaskData[0].mlstnNm);
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
              <WidgetBuilder milestonePageOpen />
            </div>
            )}
          </Grid>
          <Grid container xs={9}>
            <Grid item xs={12}>
              <div styleName="centerpane">
                <CenterPane />
              </div>
            </Grid>
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

MilestonePage.propTypes = {
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

export default MilestonePage;
export { TestExports };
