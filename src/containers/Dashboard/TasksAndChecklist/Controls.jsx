import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/CheckCircle';
import styles from './Controls.css';

function Controls({
  className, controlAction,
  disableValidation, label,
}) {
  return (
    <div className={classNames(className)}>
      <Button
        classes={{
          root: styles['control-button'],
        }}
        color="primary"
        disabled={disableValidation}
        onClick={controlAction}
      >
        <CheckIcon style={disableValidation ? null : { color: '#596FEB' }} />
        <p style={disableValidation ? null : { color: '#596FEB' }}>{label}</p>
      </Button>
    </div>
  );
}

Controls.defaultProps = {
  className: '',
  disableValidation: false,
};

Controls.propTypes = {
  className: PropTypes.string,
  controlAction: PropTypes.func.isRequired,
  disableValidation: PropTypes.bool,
  label: PropTypes.string.isRequired,
};

export default Controls;
