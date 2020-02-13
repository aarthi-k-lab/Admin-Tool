import React from 'react';
import PropTypes from 'prop-types';
import SweetAlert from 'sweetalert2-react';
import { Success, Failed, Warning } from '../../constants/alertTypes';

const SweetAlertBox = ({
  message, show, onConfirm, type,
}) => {
  let imageUrl = '';
  if (type === 'Success') {
    imageUrl = Success;
  } else if (type === 'Failed') {
    imageUrl = Failed;
  } else {
    imageUrl = Warning;
  }
  return (
    <SweetAlert
      icon="error"
      imageHeight="500"
      imageUrl={imageUrl}
      onConfirm={onConfirm}
      padding="3em"
      show={show}
      title={message}
      width="600"
    />
  );
};

SweetAlertBox.defaultProps = {
  show: false,
};

SweetAlertBox.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  show: PropTypes.bool,
  type: PropTypes.string.isRequired,
};

export default SweetAlertBox;
