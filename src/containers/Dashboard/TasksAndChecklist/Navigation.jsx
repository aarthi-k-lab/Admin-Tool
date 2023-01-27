import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import './Navigation.css';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { selectors as incomeSelectors } from 'ducks/income-calculator';
import { selectors as taskSelectors } from 'ducks/tasks-and-checklist';
import TimeAgo from './TimeAgo';

const styles = theme => ({
  root: {
    position: 'relative',
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  top: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
});

class Navigation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lastUpdated: null,
    };
  }

  static getDerivedStateFromProps(props) {
    const {
      checklistRefresh,
      incomeChecklistRefresh,
    } = props;
    if (checklistRefresh || incomeChecklistRefresh) {
      return {
        lastUpdated: moment.max(moment(new Date(checklistRefresh)),
          moment(new Date(incomeChecklistRefresh))),
      };
    }
    return null;
  }

  render() {
    const {
      checklistLoadStatus,
      incomeCalcDataLoadStatus,
      classes,
    } = this.props;

    const { lastUpdated } = this.state;
    const isLoading = R.contains('loading', [incomeCalcDataLoadStatus, checklistLoadStatus]);
    return (
      <Grid
        container
        justify="flex-end"
        styleName="navigation"
      >
        <Grid item styleName="lastUpdated" xs={2}>
          <>
            <p styleName="status">Last refreshed: </p>
            <TimeAgo classes={classes} isLoading={isLoading} lastUpdated={lastUpdated} />
          </>
        </Grid>
      </Grid>
    );
  }
}
Navigation.defaultProps = {
  incomeCalcDataLoadStatus: null,
  checklistLoadStatus: null,
};

Navigation.propTypes = {
  checklistLoadStatus: PropTypes.string,
  classes: PropTypes.shape().isRequired,
  incomeCalcDataLoadStatus: PropTypes.string,
};

const mapStateToProps = state => ({
  checklistLoadStatus: taskSelectors.getChecklistLoadStatus(state),
  checklistRefresh: taskSelectors.getLastMainChecklistRefresh(state),
  incomeChecklistRefresh: incomeSelectors.getIncomeChecklistRefresh(state),
  incomeCalcDataLoadStatus: incomeSelectors.getIncomeChecklistLoadStatus(state),
});

const navigationContainer = connect(mapStateToProps, null)(Navigation);

export default withStyles(styles)(navigationContainer);
