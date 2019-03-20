import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import * as R from 'ramda';
import RadioButtons from './RadioButtons';
import styles from './Checklist.css';

const RADIO_BUTTONS = 'radio';
const MULTILINE_TEXT = 'multiline-text';

class Checklist extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderChecklistItem = this.renderChecklistItem.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(id) {
    const { onChange } = this.props;
    return (event) => {
      onChange(id, event.target.value);
    };
  }

  renderChecklistItem({
    id,
    options,
    title,
    type,
    value,
  }) {
    const onChange = this.handleChange(id);
    switch (type) {
      case RADIO_BUTTONS:
        return (
          <RadioButtons
            onChange={onChange}
            options={options}
            selectedValue={value}
            title={title}
          />
        );
      case MULTILINE_TEXT: {
        const textField = (
          <TextField
            label={title}
            maxRows={10}
            multiline
            onChange={onChange}
            rows={5}
            value={value}
          />
        );
        const hint = R.prop('hint', options);
        if (R.isNil(hint) || R.isEmpty(hint)) {
          return textField;
        }
        return (
          <Tooltip
            classes={{
              tooltip: styles.tooltip,
            }}
            disableFocusListener
            disableTouchListener
            placement="right"
            title={hint}
          >
            {textField}
          </Tooltip>
        );
      }
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
    const {
      checklistItems, children,
      className, title,
    } = this.props;
    return (
      <section className={className}>
        { children }
        <Typography styleName="checklist-title" variant="h5">{title}</Typography>
        <div styleName="checklist-scroll-out">
          <div styleName="checklist-scroll-in">
            <Paper elevation={1} styleName="checklist-form-controls">
              {
                checklistItems
                  .filter(({ isVisible }) => isVisible)
                  .map(this.renderChecklistItem)
              }
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
      id: PropTypes.string.isRequired,
      isVisible: PropTypes.bool,
      options: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
      title: PropTypes.string.isRequired,
      type: PropTypes.oneOf([RADIO_BUTTONS, MULTILINE_TEXT]).isRequired,
      value: PropTypes.any,
    }),
  ).isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default Checklist;
