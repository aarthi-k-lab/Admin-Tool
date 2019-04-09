import Checkbox from '@material-ui/core/Checkbox';
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import * as R from 'ramda';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import PropTypes from 'prop-types';
import './ExpandPanel.css';

class ExpandPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      panels: [],
    };
    this.renderPanel = this.renderPanel.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getMaxDateIndex = this.getMaxDateIndex.bind(this);
    this.getMaxDateIndex(props.monthlyDetails);
  }

  getMaxDateIndex(monthlyDetails) {
    let maxDate;
    let maxDateIndex;
    monthlyDetails.forEach((detail, index) => {
      if (detail.monthDetail) {
        detail.monthDetail.forEach((value) => {
          if (value.header === 'Trial Due On') {
            const currentDate = new Date(value.value);
            if (currentDate > maxDate) {
              maxDateIndex = index;
            } else {
              maxDateIndex = index - 1;
            }
            maxDate = currentDate;
          }
        });
      }
    });
    this.dateIndex = maxDateIndex;
  }

  handleExpandAll() {
    const { isExpanded, panels } = this.state;
    const { monthlyDetails } = this.props;
    let currentPanel = 0;
    while (currentPanel < monthlyDetails.length) {
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

  renderPanel() {
    const { isExpanded, panels } = this.state;
    const { monthlyDetails } = this.props;
    return (
      <>
        <div styleName="expand-all">
          <ExpansionPanel
            expanded={isExpanded}
            onChange={() => this.handleExpandAll()}
            styleName="button-border"
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} styleName="button">
              <Typography styleName="button-heading">{isExpanded ? 'Collapse All' : 'Expand All'}</Typography>
            </ExpansionPanelSummary>
          </ExpansionPanel>
        </div>
        <div styleName="detail-list">
          {
            monthlyDetails.map((value, index) => (
              <ExpansionPanel
                // eslint-disable-next-line no-nested-ternary
                expanded={index !== this.dateIndex ? R.isNil(panels[index])
                  ? false : panels[index] : true}
                onChange={() => this.handleClick(index)}
                styleName="panel-border"
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} styleName="summary">
                  <Checkbox
                    checked
                    checkedIcon={<CircleCheckedFilled />}
                    icon={<CircleUnchecked />}
                    styleName={R.toLower(value.status)}
                    value="checkedG"
                  />
                  <span styleName="heading">{value.title}</span>
                  <span styleName="secondary-heading">{value.month}</span>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails styleName="expand-panel-details">
                  <Grid container>
                    {value.monthDetail && value.monthDetail.map(detail => (
                      <Grid item xs={2}>
                        <span styleName="header-style">{detail.header}</span>
                        <br />
                        <span styleName="value-style">{detail.value}</span>
                      </Grid>
                    ))
                    }
                  </Grid>
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
      this.renderPanel()
    );
  }
}

ExpandPanel.propTypes = {
  monthlyDetails: PropTypes.shape({
    details: PropTypes.string.isRequired,
    month: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};
const TestHooks = {
  ExpandPanel,
};
export default ExpandPanel;
export {
  TestHooks,
};
