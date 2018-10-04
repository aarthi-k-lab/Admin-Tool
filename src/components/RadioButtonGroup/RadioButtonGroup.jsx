import React from 'react';
import PropTypes from 'prop-types';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import SaveIcon from '@material-ui/icons/Save';
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
    this.setState({ selected: event.target.value });
    onChange(event.target.value);
  }

  renderItem(item) {
    const { selected: selectedValue } = this.state;
    const isSelected = item.key === selectedValue;
    const saveIcon = (
      <Tooltip
        disableFocusListener
        disableHoverListener={!isSelected}
        disableTouchListener
        title="Save"
      >
        <SaveIcon styleName={isSelected ? 'save-icon' : 'save-icon--disabled'} />
      </Tooltip>
    );
    const label = (
      <>
        <span>{item.value}</span>
        <br />
        {saveIcon}
        <span styleName="addtional-info">{item.additionalInfo}</span>
      </>
    );
    return (
      <FormControlLabel
        key={item.key}
        classes={{
          label: styles.label,
        }}
        control={<Radio />}
        label={label}
        styleName="form-control"
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
          {items.map(this.renderItem)}
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
    additionalInfo: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

export default RadioButtonGroup;
