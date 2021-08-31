import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import './DelayChecklistHistory.css';

class DelayChecklistHistoy extends React.PureComponent {
  getCompletedByName = (name) => {
    const userName = name && name.includes('@')
      ? name.split('@')[0].replace(/\./g, ' ').replace(/[0-9]/g, '')
      : name;
    return (
      <>
        <span>By&nbsp;&nbsp;</span>
        <span style={{ color: '#333940', fontWeight: 'bold' }}>{userName}</span>
      </>
    );
  };

  render() {
    const { history } = this.props;
    const { completedByName, completedDate, reasonsList } = history;
    return (
      <Card styleName="historyCard">
        <Grid styleName="containerGrid">
          <Grid item styleName="tagsContainer">
            {reasonsList && reasonsList.map(reason => (
              <div key={reason} styleName="tags">
                {reason}
              </div>
            )) }
          </Grid>
          <Grid item styleName="completedInfo">
            <span>{moment(completedDate).format('MMM DD, YYYY hh:mm A')}</span>
            <span>{this.getCompletedByName(completedByName)}</span>
          </Grid>
        </Grid>
      </Card>
    );
  }
}

DelayChecklistHistoy.propTypes = {
  history: PropTypes.shape({
    completedByName: PropTypes.string,
    completedDate: PropTypes.string,
    delayChecklistReason: PropTypes.string,
    reasonsList: PropTypes.arrayOf(PropTypes.string),
    taskId: PropTypes.string,
  }).isRequired,
};

export default DelayChecklistHistoy;
