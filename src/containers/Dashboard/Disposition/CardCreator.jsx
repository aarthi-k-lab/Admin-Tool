import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { RadioGroup } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import PropTypes from 'prop-types';
import { operations } from '../../../state/ducks/dashboard';
import styles from './Disposition.css';


class CardCreator extends React.Component {
  constructor(props) {
    super(props);
    const { status, selectedActivity } = props;
    this.state = {
      status,
      selectedActivity,
    };
  }

  componentWillReceiveProps(props) {
    const { status, selectedActivity } = props;
    this.setState({ status, selectedActivity });
  }

  handleExpandClick() {
    const { status, selectedActivity } = this.state;
    const { onDispositionSelect } = this.props;
    let changedStatus = null;
    changedStatus = {
      ...status,
      expanded: !status.expanded,
    };

    const payload = {
      cardStatus: {
        Name: changedStatus.name,
        isExpanded: changedStatus.expanded,
      },
      id: status.id,
      isActivitySelected: false,
      activityName: selectedActivity,
    };
    onDispositionSelect(payload);
    this.setState({ status: changedStatus });
  }

  handleRadioClick(name, activityName) {
    const { status } = this.state;
    const { onDispositionSelect } = this.props;
    const payload = {
      id: status.id,
      statusName: name,
      isActivitySelected: true,
      activityName,
    };
    onDispositionSelect(payload);
  }

  renderActivity(item, selectedActivity, m) {
    return (
      <Tooltip
        key={item.id}
        classes={{ tooltip: styles.tooltip }}
        placement="right"
        title={item.verbiage}
      >
        <div styleName="radio-button-gap">
          <FormControlLabel
            key={item.id}
            classes={{
              label: styles.label,
            }}
            control={(
              <Radio
                checked={
                  selectedActivity
                  === item.activityName
                }
                styleName="RadioButtonStyle"
              />
            )}
            label={item.activityName}
            onClick={() => this.handleRadioClick(m.name, item.activityName)
          }
            value={item.activityName}
          />
        </div>
      </Tooltip>
    );
  }

  render() {
    const { selectedActivity } = this.state;
    const { status: m } = this.state;
    const { disabled } = this.props;
    return (
      <Card
        key={m.id}
        disabled
        styleName="CardStyle"
      >
        <CardActions disableSpacing styleName="CardActionsStyle">
          <span styleName="GroupNames">
            {m.name}
          </span>
          <span
            styleName={m.labelDisplay === 'none' ? 'label-false' : 'label-true'}
          >
                SELECTED
          </span>
          <IconButton aria-expanded={m.expanded} aria-label="Show more" disabled={disabled} onClick={() => this.handleExpandClick(m)}>
            {m.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </CardActions>
        <Collapse in={m.expanded} timeout="auto" unmountOnExit>
          <CardContent styleName="CardContentStyle">
            <RadioGroup aria-label="activityName">
              {m.activities.map(item => (
                this.renderActivity(item, selectedActivity, m)
              ))}
            </RadioGroup>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onDispositionSelect: operations.onDispositionSelect(dispatch),
});

CardCreator.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onDispositionSelect: PropTypes.func.isRequired,
  selectedActivity: PropTypes.string.isRequired,
  status: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const CardCreatorContainer = connect(null, mapDispatchToProps)(CardCreator);

export default CardCreatorContainer;

const TestHooks = {
  CardCreator,
};

export {
  TestHooks,
};
