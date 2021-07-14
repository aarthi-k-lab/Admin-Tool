import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import './CustomButton.css';

const CustomButton = (props) => {
  const {
    title,
    onChange,
    additionalInfo: { variant },
    state,
  } = props;

  const isEnabled = state === 'completed';
  return (
    <div styleName={variant === 'addTaskSection' ? 'customVariant' : 'custom'}>
      <Button
        color={isEnabled ? 'primary' : 'secondary'}
        disabled={!isEnabled}
        onClick={() => onChange(true)}
        styleName={variant === 'addTaskSection' ? 'containedVariant' : 'contained'}
        variant="contained"
      >
        {title}
        {variant === 'addTaskSection' ? null : <AddCircleOutlineIcon />}
      </Button>
    </div>
  );
};

CustomButton.defaultProps = {
  state: 'completed',
  additionalInfo: {},
};

CustomButton.propTypes = {
  additionalInfo: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  state: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default CustomButton;
