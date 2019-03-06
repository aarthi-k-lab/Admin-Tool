import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/CheckCircle';
import styles from './Controls.css';

function Controls({ className, disableValidation }) {
  return (
    <div className={classNames(className)}>
      <Button
        classes={{
          root: styles['control-button'],
        }}
        color="primary"
        disabled={disableValidation}
      >
        <CheckIcon />
        Validate
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
  disableValidation: PropTypes.bool,
};

export default Controls;
