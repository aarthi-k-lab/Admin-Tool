import React from 'react';
import moment from 'moment-timezone';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TaskStatusIcon from 'components/TaskStatusIcon';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import './TrialDetails.css';

class TrialDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      panels: [],
    };
    this.isFirstNaPaidOn = true;
    this.renderPanel = this.renderPanel.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleExpandAll() {
    const { isExpanded, panels } = this.state;
    const { trialsDetail } = this.props;
    let currentPanel = 0;
    while (currentPanel < trialsDetail.length) {
      panels[currentPanel] = !isExpanded;
      currentPanel += 1;
    }
    this.dateIndex = null;
    this.setState({
      isExpanded: !isExpanded,
      panels,
    });
  }

  handleClick(panelIndex) {
    const { panels } = this.state;
    panels[panelIndex] = this.dateIndex === panelIndex ? false : !panels[panelIndex];
    this.dateIndex = null;
    this.setState({
      ...panels,
      panels,
      isExpanded: false,
    });
  }

  customExpand(index, panels, paidOn) {
    const naPaidOn = moment(paidOn).format('MM/DD/YYYY') === '01/01/0001';
    if (naPaidOn && this.isFirstNaPaidOn) {
      this.isFirstNaPaidOn = false;
      return true;
    }
    // eslint-disable-next-line no-nested-ternary
    return index !== this.dateIndex ? R.isNil(panels[index]) ? false : panels[index] : true;
  }

  renderExpandAllCollapseAll() {
    const { isExpanded } = this.state;
    return (
      <ExpansionPanel
        expanded={isExpanded}
        onChange={this.handleExpandAll}
        styleName="button-border"
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} styleName="button">
          <Typography styleName="button-heading">{isExpanded ? 'Collapse All' : 'Expand All'}</Typography>
        </ExpansionPanelSummary>
      </ExpansionPanel>
    );
  }

  renderPanel() {
    const { panels } = this.state;
    const { trialsDetail } = this.props;
    const opt = 'MM/DD/YYYY';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
    const trialsDetailData = trialsDetail && R.sortBy(R.prop('number'), trialsDetail);
    return (
      <>
        <div styleName="detail-list">
          {
            trialsDetailData.map((myTrial, index) => (
              <ExpansionPanel
                key={myTrial.sequence}
                expanded={this.customExpand(index, panels, myTrial.paidOn)}
                onChange={() => this.handleClick(index)}
                styleName="panel-border"
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} styleName="summary">
                  <TaskStatusIcon
                    isSubTask
                    task={{ state: moment(myTrial.paidOn).format(opt) !== '01/01/0001' && 'completed' }}
                  />
                  <span styleName="heading">
                    {myTrial.trialName.includes('Trial') ? 'Trial ' : 'Forbearance '}
                    {myTrial.sequence}
                  </span>
                  <span styleName="secondary-heading">{R.toUpper(myTrial.trialPmtMonthYear)}</span>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails styleName="expand-panel-details">
                  <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex' }}>
                      <div style={{ background: '#ebebec' }} styleName="monthDetailStyle" xs={3}>
                        <span styleName="header-style">Total Trial Amount</span>
                        <span style={{ fontSize: '1.2rem', background: '#ebebec' }} styleName="value-style">{formatter.format(myTrial.totalTrialAmount)}</span>
                      </div>
                      <div style={{ background: '#f5f5f5' }} styleName="monthDetailStyle" xs={1}>
                        <span styleName="header-style">P&I</span>
                        <span style={{ fontSize: '0.9rem' }} styleName="value-style">{formatter.format(myTrial.pandIAmount)}</span>
                      </div>
                      <div style={{ background: '#f5f5f5' }} styleName="monthDetailStyle" xs={1}>
                        <span styleName="header-style">Escrow</span>
                        <span style={{ fontSize: '0.9rem' }} styleName="value-style">{formatter.format(myTrial.escrowAmount)}</span>
                      </div>
                      <div styleName="monthDetailStyle" xs={1}>
                        <span styleName="header-style">Trial Due On</span>
                        <span style={{ fontSize: '0.9rem' }} styleName="value-style">{moment(myTrial.trialDueOn).format(opt)}</span>
                      </div>
                      <div styleName="monthDetailStyle" xs={1}>
                        <span styleName="header-style">Deadline On</span>
                        <span style={{ fontSize: '0.9rem' }} styleName="value-style">{moment(myTrial.deadlineOn).format(opt)}</span>
                      </div>
                      <div styleName="monthDetailStyle" xs={1}>
                        <span styleName="header-style">Paid On</span>
                        <span style={{ fontSize: '0.9rem' }} styleName="value-style">
                          {moment(myTrial.paidOn).format(opt) !== '01/01/0001' ? moment(myTrial.paidOn).format(opt) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))
          }
        </div>
      </>
    );
  }

  render() {
    return (
      <>
        {/* <div styleName="expand-all">
          <ExpandAllCollapseAll handleExpandAll={this.handleExpandAll} isExpanded={isExpanded} />
        </div> */}
        <div styleName="expand-all">
          {this.renderExpandAllCollapseAll()}
        </div>
        {/* <div styleName="detail-list"> */}
        {this.renderPanel()}
        {/* </div> */}
      </>
    );
  }
}

TrialDetails.defaultProps = {
  trialsDetail: [],
};
TrialDetails.propTypes = {
  trialsDetail: PropTypes.arrayOf(
    PropTypes.shape({
      deadlineOn: PropTypes.string,
      escrowAmount: PropTypes.string,
      evalId: PropTypes.number,
      forbearanceId: PropTypes.number,
      paidOn: PropTypes.string,
      pandIAmount: PropTypes.string,
      resolutionId: PropTypes.number,
      sequence: PropTypes.string,
      totalTrialAmount: PropTypes.string,
      trialDueOn: PropTypes.string,
      trialName: PropTypes.string,
      trialPmtMonthYear: PropTypes.string,
    }),
  ),
};
const TestHooks = {
  TrialDetails,
};
export default TrialDetails;
export {
  TestHooks,
};
