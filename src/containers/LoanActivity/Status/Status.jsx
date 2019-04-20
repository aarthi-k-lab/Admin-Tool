import React from 'react';
import PropTypes from 'prop-types';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import StepConnector from '@material-ui/core/StepConnector';
import Grid from '@material-ui/core/Grid';
import CardIcon from '@material-ui/icons/Person';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { withStyles } from '@material-ui/core/styles';
import './Status.css';

const styles = () => ({
  connectorDisabled: {
    padding: 0,
  },
  connectorLine: {
    minHeight: 'auto',
  },
  inactiveIconContainer: {
    position: 'relative',
    top: '70px',
    left: '-6px',
  },
  activeIconContainer: {
    position: 'relative',
    top: '70px',
    left: '-8px',
  },
  inactiveIcon: {
    color: '#9e9e9e !important',
    width: '12px',
  },
  activeIcon: {
    color: '#9e9e9e !important',
    width: '18px',
  },
  iconText: {
    display: 'none !important',
  },
  // Need to revert it once gets integrated with service
  labelRoot: {
    // borderLeft: '1px solid #bdbdbd',
    marginLeft: '12px',
    display: 'none',
  },
});

class Status extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(type) {
    const { onCardClick } = this.props;
    onCardClick(type);
  }

  // This method is only for mock ui display
  // eslint-disable-next-line class-methods-use-this
  isFirst(index) {
    return index === 0;
  }

  render() {
    const { classes } = this.props;
    const { statusList, clickedCard } = this.props;
    const connector = (
      <StepConnector
        classes={{
          disabled: classes.connectorDisabled,
          line: classes.connectorLine,
        }}
      />
    );
    return (
      <>
        {/* TO- DO  Conditional statements will be changed when we get a actual response */}
        <Stepper connector={connector} orientation="vertical" styleName="stepper">
          {statusList.map((parent, index) => (
            <Step key={parent.header} active>
              <StepLabel
                classes={{
                  iconContainer: this.isFirst(index) ? classes.activeIconContainer
                    : classes.inactiveIconContainer,
                  root: classes.labelRoot,
                }}
                StepIconProps={{
                  classes: {
                    root: this.isFirst(index) ? classes.activeIcon : classes.inactiveIcon,
                    text: classes.iconText,
                  },
                }}
                styleName={index === 0 ? 'no-border' : ''}
              />
              <StepContent styleName="step-content">
                <div styleName="cards">
                  <div styleName={`parent-card ${clickedCard === parent.type ? 'active' : ''}`}>
                    <Grid container onClick={() => this.handleClick(parent.type)} styleName="main-container">
                      <Grid item styleName="image" xs={1}>
                        {parent.type === 'Trial' ? (<CardIcon styleName="icon" />) : (<AssignmentIcon styleName="icon" />)}
                      </Grid>
                      <Grid item styleName="user-detail" xs={7}>
                        <span styleName="value-style">{parent.header}</span>
                        <br />
                        <span styleName="header-style">{parent.assignee}</span>
                      </Grid>
                      <Grid item styleName="right-item" xs={4}>
                        <span styleName={parent.status === 'FAILED' ? 'failedStatus' : 'completedStatus'}>{parent.status}</span>
                        <span styleName="header-style align">{parent.days}</span>
                      </Grid>
                    </Grid>
                    <Grid container onClick={() => this.handleClick(parent.type)} styleName="sub-container">
                      <Grid item styleName="item" xs={3}>
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
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </>
    );
  }
}

Status.propTypes = {
  classes: PropTypes.shape.isRequired,
  clickedCard: PropTypes.string.isRequired,
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
export default withStyles(styles)(Status);
export {
  TestHooks,
};