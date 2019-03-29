import React from 'react';
import Grid from '@material-ui/core/Grid';
import CardIcon from '@material-ui/icons/Person';
import PropTypes from 'prop-types';
import './Status.css';

class Status extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { onCardClick } = this.props;
    onCardClick();
  }

  render() {
    const { statusList } = this.props;
    return (
      <>
        {statusList.map(parent => (
          <div styleName="cards">
            <div styleName="parent-card">
              <Grid container onClick={() => this.handleClick()} styleName="main-container">
                <Grid item styleName="image" xs={1}>
                  <CardIcon styleName="icon" />
                </Grid>
                <Grid item styleName="user-detail" xs={7}>
                  <span styleName="value-style">{parent.header}</span>
                  <br />
                  <span styleName="header-style">{parent.assignee}</span>
                </Grid>
                <Grid item styleName="right-item" xs={4}>
                  <span styleName={parent.status === 'FAILED' ? 'failedStatus' : 'completedStatus'}>{parent.status}</span>
                  <span styleName="header-style align">In 67 days</span>
                </Grid>
              </Grid>
              <Grid container onClick={() => this.handleClick()} styleName="sub-container">
                <Grid item styleName="item left-item" xs={3}>
                  <span styleName="header-style">START DATE</span>
                  <br />
                  <span styleName="value-style">{parent.startDate}</span>
                </Grid>
                <Grid item styleName="item" xs={3}>
                  <span styleName="header-style">END DATE</span>
                  <br />
                  <span styleName="value-style">{parent.endDate}</span>
                </Grid>
                <Grid item styleName="item" xs={5}>
                  <span styleName="header-style">EXPECTED COMPLETION DATE</span>
                  <br />
                  <span styleName="value-style">{parent.expectedCompletionDate}</span>
                </Grid>
              </Grid>
            </div>
            {parent.child && parent.child.map(child => (
              <div style={{ padding: '15px 0px 10px 40px' }}>
                <Grid container styleName="child-grid">
                  <Grid item xs={9}>
                    <span styleName="value-style">{child.header}</span>
                    <br />
                    <span styleName="header-style">{child.assignee}</span>
                  </Grid>
                  <Grid item xs={3}>
                    <span styleName="header-style">{child.status}</span>
                    <br />
                    <span styleName="header-style">{child.statusDate}</span>
                  </Grid>
                </Grid>
              </div>
            ))}
          </div>
        ))}
      </>
    );
  }
}

Status.propTypes = {
  onCardClick: PropTypes.func.isRequired,
  statusList: PropTypes.shape({
    assignee: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    expectedCompletionDate: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};
const TestHooks = {
  Status,
};
export default Status;
export {
  TestHooks,
};
