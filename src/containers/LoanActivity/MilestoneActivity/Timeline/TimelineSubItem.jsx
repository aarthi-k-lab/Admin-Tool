import React from 'react';
import PropTypes from 'prop-types';
import './TimelineSubItem.css';
import moment from 'moment-timezone';
import Grid from '@material-ui/core/Grid';
import * as R from 'ramda';

class TimelineSubItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }

  render() {
    const { grpData } = this.props;
    const { isOpen } = this.state;
    const assignUserName = grpData.lastAsgn.lastIndexOf('@') !== -1
      ? grpData.lastAsgn.substring(0, grpData.lastAsgn.lastIndexOf('@')) : grpData.lastAsgn;
    return (
      <>
        {isOpen && (
        <div styleName="timeline-item">
          <div styleName="timeline-item-content">
            <Grid container>
              <Grid item styleName="user-detail" xs={7}>
                <span styleName="header-style">{grpData.disName}</span>
                <br />
                <span styleName="resolutionChoiceType">{assignUserName}</span>
              </Grid>
              <Grid item styleName="user-detail" xs={5}>
                {!R.isNil(grpData) && <div styleName={R.contains(R.propOr('N/A', 'disCat', grpData), ['Rejected', 'Failed']) ? 'failedStatus' : 'successStatus'}>{grpData.disCat}</div>}
                <div>
                  <span styleName="header-style">
                    {moment(grpData.stsDttm).tz('America/Chicago').format('DD/MM/YYYY HH:mm:ss')}
                  </span>
                </div>
              </Grid>
            </Grid>
            <span styleName="circle" />
          </div>
        </div>
        )}
      </>
    );
  }
}

const TestExports = {
  TimelineSubItem,
};

TimelineSubItem.propTypes = {
  grpData: PropTypes.shape({
    disCat: PropTypes.string,
    disName: PropTypes.string,
    lastAsgn: PropTypes.string,
    stsDttm: PropTypes.string,
  }).isRequired,
};

export default TimelineSubItem;
export { TestExports };
