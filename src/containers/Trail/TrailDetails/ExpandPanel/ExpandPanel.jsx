/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
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
];

class ExpandPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.renderPanel = this.renderPanel.bind(this);
  }

  expandAll() {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  }

  renderPanel() {
    const { expanded } = this.state;
    return (
      <div>
        <div styleName="expand-all">
          <ExpansionPanel
            expanded={expanded}
            onChange={() => this.setState({ expanded: !expanded })}
            styleName="button-border"
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} styleName="button">
              <Typography styleName="button-heading">Expand All</Typography>
            </ExpansionPanelSummary>
          </ExpansionPanel>
        </div>
        {
          data.map(value => (
            <ExpansionPanel
              expanded={expanded}
              onChange={() => this.setState({ expanded: !expanded })}
              styleName="panel-border"
            >
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography styleName="heading">{value.title}</Typography>
                <Typography styleName="secondaryHeading">{value.month}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
                  Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                  maximus est, id dignissim quam.
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))
        }
      </div>
    );
  }

  render() {
    return (
      this.renderPanel()
    );
  }
}

ExpandPanel.propTypes = {
  details: PropTypes.shape({
    acceptanceDate: PropTypes.string.isRequired,
    downPayment: PropTypes.string.isRequired,
    receivedDate: PropTypes.string.isRequired,
    sentOn: PropTypes.string.isRequired,
  }).isRequired,
};

export default ExpandPanel;
