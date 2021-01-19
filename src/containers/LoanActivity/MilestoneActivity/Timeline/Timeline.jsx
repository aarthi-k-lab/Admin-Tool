import React from 'react';
import PropTypes from 'prop-types';
import TimelineItem from './TimelineItem';
import './Timeline.css';

class Timeline extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      taskId: 0,
    };
  }

  handleTimelineClick = (taskId) => {
    this.setState({ taskId });
  }

  render() {
    const { groupTaskData, prcsId } = this.props;
    const { taskId } = this.state;
    return (
      <div styleName="timeline-container">
        {groupTaskData && groupTaskData.map((taskData, index) => (
          <TimelineItem
            key={taskData.maxCreDttm}
            active={(taskId === 0 && index === 0) || taskData.taskId === taskId}
            handleTimelineClick={this.handleTimelineClick}
            prcsId={prcsId}
            taskData={taskData}
          />
        ))}
      </div>
    );
  }
}

const TestExports = {
  Timeline,
};

Timeline.propTypes = {
  groupTaskData: PropTypes.arrayOf(
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
  prcsId: PropTypes.string.isRequired,
};

export default Timeline;
export { TestExports };
