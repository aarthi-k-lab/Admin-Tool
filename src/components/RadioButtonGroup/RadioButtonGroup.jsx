import React from 'react';
import PropTypes from 'prop-types';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import styles from './RadioButtonGroup.css';

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
    this.setState({ selected: event.target.value });
    onChange(event.target.value);
  }

  static renderItem(item) {
    return (
      <FormControlLabel
        key={item.key}
        classes={{
          label: styles.label,
        }}
        control={<Radio />}
        label={item.value}
        value={item.key}
      />
    );
  }

  render() {
    const { selected } = this.state;
    const { items, name } = this.props;
    return (
      <Paper styleName="paper-sheet">
        <RadioGroup
          name={name}
          onChange={this.handleChange}
          styleName="radio-buttons"
          value={selected}
        >
          {items.map(this.constructor.renderItem)}
        </RadioGroup>
      </Paper>
    );
  }
}

RadioButtonGroup.defaultProps = {
  onChange: () => {},
};

RadioButtonGroup.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

export default RadioButtonGroup;
