import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import RadioButtons from './RadioButtons';
import './Checklist.css';

const RADIO_BUTTONS = 'radio';
const MULTILINE_TEXT = 'multiline-text';

class Checklist extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderChecklistItem = this.renderChecklistItem.bind(this);
  }

  handleChange(event) {
    console.log(event, this.a); // #TODO
  }

  renderChecklistItem({ options, title, type }) {
    switch (type) {
      case RADIO_BUTTONS:
        return (
          <RadioButtons
            onChange={this.handleChange}
            options={options}
            title={title}
          />
        );
      case MULTILINE_TEXT:
        return (
          <TextField label={title} maxRows={10} multiline rows={5} />
        );
      default:
        return (
          <div>
            Unknown checklist item type:
            {type}
          </div>
        );
    }
  }

  render() {
    const { checklistItems, className, title } = this.props;
    return (
      <section className={className}>
        <Typography styleName="checklist-title" variant="h5">{title}</Typography>
        <div styleName="checklist-scroll-out">
          <div styleName="checklist-scroll-in">
            <Paper elevation={1} styleName="checklist-form-controls">
              {checklistItems.map(this.renderChecklistItem)}
            </Paper>
          </div>
        </div>
      </section>
    );
  }
}

Checklist.defaultProps = {
  className: '',
};

Checklist.propTypes = {
  checklistItems: PropTypes.arrayOf(
    PropTypes.shape({
      options: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
      title: PropTypes.string.isRequired,
      type: PropTypes.oneOf([RADIO_BUTTONS, MULTILINE_TEXT]).isRequired,
    }),
  ).isRequired,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default Checklist;
