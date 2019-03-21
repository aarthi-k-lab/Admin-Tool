/* eslint-disable class-methods-use-this */
import Checkbox from '@material-ui/core/Checkbox';
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import PropTypes from 'prop-types';
import './ExpandPanel.css';


class ExpandPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      expandAll: false,
      panel: null,
    };
    this.renderPanel = this.renderPanel.bind(this);
  }


  renderPanel() {
    const { panel, expanded, expandAll } = this.state;
    const { data } = this.props;
    return (
      <>
        <div styleName="expand-all">
          <ExpansionPanel
            expanded={expandAll}
            onChange={() => this.setState(
              { expandAll: !expandAll, expanded: !expandAll, panel: null },
            )}
            styleName="button-border"
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} styleName="button">
              <Typography styleName="button-heading">{expandAll ? 'Collapse All' : 'Expand All'}</Typography>
            </ExpansionPanelSummary>
          </ExpansionPanel>
        </div>
        <div styleName="detail-list">
          {
            data && data.map(value => (
              <ExpansionPanel
                expanded={expandAll || (panel === value.title && expanded)}
                onClick={() => {
                  this.setState({
                    panel: value.title,
                    expanded: !expanded,
                  });
                }}
                styleName="panel-border"
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Checkbox
                    checked
                    checkedIcon={<CircleCheckedFilled />}
                    icon={<CircleUnchecked />}
                    styleName={value.title === 'Trail3' ? 'uncheckbox' : 'checkbox'}
                    value="checkedG"
                  />
                  <span styleName="heading">{value.title}</span>
                  <span styleName="secondaryHeading">{value.month}</span>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container>
                    {value.details && value.details.map(detail => (
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
  data: PropTypes.shape({
    details: PropTypes.string.isRequired,
    month: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default ExpandPanel;
