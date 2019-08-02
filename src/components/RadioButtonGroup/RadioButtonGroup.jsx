import React from 'react';
import PropTypes from 'prop-types';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import FormControlLabelWithTooltip from './FormControlLabelWithTooltip';
import styles from './RadioButtonGroup.css';

class RadioButtonGroup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  handleChange(event) {
    const { onChange } = this.props;
    const selected = event.target.value;
    this.setState({ selected });
    onChange(selected);
  }

  renderItem(item) {
    const { disableDisposition } = this.props;
    const label = <span>{item.value}</span>;
    return (
      <FormControlLabelWithTooltip
        key={item.key}
        classes={{
          label: styles.label,
        }}
        control={<Radio />}
        disabled={disableDisposition}
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
      <Paper elevation={2} styleName="paper-sheet">
        <RadioGroup
          name={name}
          onChange={this.handleChange}
          styleName="radio-buttons"
          value={selectedDisposition}
        >
          {items.map(this.renderItem)}
        </RadioGroup>
      </Paper>
    );
  }
}

RadioButtonGroup.defaultProps = {
  clearSelectedDisposition: false,
  disableDisposition: false,
  onChange: () => { },
};

RadioButtonGroup.propTypes = {
  clearSelectedDisposition: PropTypes.bool,
  disableDisposition: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape({
    additionalInfo: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

export default RadioButtonGroup;
