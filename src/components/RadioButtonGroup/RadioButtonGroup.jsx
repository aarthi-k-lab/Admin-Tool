import React from 'react';
import PropTypes from 'prop-types';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import styles from './RadioButtonGroup.css';

class FormControlWithTooltip extends FormControlLabel {
  render() {
    const { tooltip } = this.props;
    return (
      <Tooltip
        classes={{
          tooltip: styles.tooltip,
        }}
        disableFocusListener
        disableTouchListener
        placement="right"
        title={tooltip}
      >
        {super.render()}
      </Tooltip>
    );
  }
}

class RadioButtonGroup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { onChange } = this.props;
    const selected = event.target.value;
    this.setState({ selected });
    onChange(selected);
  }

  static renderItem(item) {
    const label = <span>{item.value}</span>;
    return (
      <FormControlWithTooltip
        key={item.key}
        classes={{
          label: styles.label,
        }}
        control={<Radio />}
        label={label}
        styleName="form-control"
        tooltip={item.additionalInfo}
        value={item.key}
      />
    );
  }

  render() {
    const { selected } = this.state;
    const { clearSelectedDisposition, items, name } = this.props;
    const selectedDisposition = clearSelectedDisposition ? '' : selected;
    return (
      <Paper styleName="paper-sheet">
        <RadioGroup
          name={name}
          onChange={this.handleChange}
          styleName="radio-buttons"
          value={selectedDisposition}
        >
          {items.map(this.constructor.renderItem)}
        </RadioGroup>
      </Paper>
    );
  }
}

RadioButtonGroup.defaultProps = {
  clearSelectedDisposition: false,
  onChange: () => {},
};

RadioButtonGroup.propTypes = {
  clearSelectedDisposition: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape({
    additionalInfo: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

export default RadioButtonGroup;
