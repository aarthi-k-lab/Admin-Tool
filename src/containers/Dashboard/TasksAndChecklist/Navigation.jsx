import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import './Navigation.css';

function Navigation({
  className,
  disableNext,
  disablePrev,
  onNext,
  onPrev,
}) {
  return (
    <div className={classNames(className)}>
      <Button
        color="primary"
        disabled={disablePrev}
        onClick={onPrev}
        styleName="nav-button"
      >
        Prev
      </Button>
      <Button
        color="primary"
        disabled={disableNext}
        onClick={onNext}
        styleName="nav-button"
      >
        Next
      </Button>
    </div>
  );
}

Navigation.defaultProps = {
  className: '',
  disableNext: false,
  disablePrev: false,
};

Navigation.propTypes = {
  className: PropTypes.string,
  disableNext: PropTypes.bool,
  disablePrev: PropTypes.bool,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
};

export default Navigation;
