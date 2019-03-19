import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import './Navigation.css';

class Navigation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { navigationList } = this.props;
    return (
      <>
        <div styleName="navigation">
          {navigationList.map(parent => (
            <div style={{ padding: '15px 0px 15px 0px' }}>
              <Grid container styleName="parent-grid">
                <Grid item xs={2}>
                  Img
                </Grid>
                <Grid item xs={7}>
                  <span styleName="value-style">{parent.header}</span>
                  <br />
                  <span styleName="header-style">{parent.assignee}</span>
                </Grid>
                <Grid item xs={3}>
                  <span styleName={parent.status === 'FAILED' ? 'failedStatus' : 'completedStatus'}>{parent.status}</span>
                  <br />
                  <span styleName="header-style">In 67 days</span>
                </Grid>
                <br />
                <br />
                <br />
                <br />
                <Grid item xs={3}>
                  <span styleName="header-style">START DATE</span>
                  <br />
                  <span styleName="value-style">{parent.startDate}</span>
                </Grid>
                <Grid item xs={3}>
                  <span styleName="header-style">END DATE</span>
                  <br />
                  <span styleName="value-style">{parent.endDate}</span>
                </Grid>
                <Grid item xs={6}>
                  <span styleName="header-style">EXPECTED COMPLETION DATE</span>
                  <br />
                  <span styleName="value-style">{parent.expectedCompletionDate}</span>
                </Grid>
              </Grid>
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
        </div>
      </>
    );
  }
}

Navigation.propTypes = {
  navigationList: PropTypes.shape({
    assignee: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    expectedCompletionDate: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default Navigation;
