/* eslint-disable class-methods-use-this */
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './ExpandPanel.css';

const data = [{
  title: 'Trail1',
  month: 'January 2019',
},
{
  title: 'Trail2',
  month: 'February 2020',
},
{
  title: 'Trail3',
  month: 'February 2020',
},
{
  title: 'Trail4',
  month: 'February 2020',
},
{
  title: 'Trail5',
  month: 'February 2020',
},
{
  title: 'Trail6',
  month: 'February 2020',
},
{
  title: 'Trail7',
  month: 'February 2020',
},
{
  title: 'Trail8',
  month: 'February 2020',
},
{
  title: 'Trail9',
  month: 'February 2020',
},
{
  title: 'Trail0',
  month: 'February 2020',
},
];

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
            data.map(value => (
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
                  <Typography styleName="heading">{value.title}</Typography>
                  <Typography styleName="secondaryHeading">{value.month}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography>
                    Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                    Aliquam eget maximus est, id dignissim quam.
                  </Typography>
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

export default ExpandPanel;
