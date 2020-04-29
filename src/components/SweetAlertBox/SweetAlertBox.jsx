import React from 'react';
import PropTypes from 'prop-types';
import SweetAlert from 'sweetalert2-react';
import imageUrls from '../../constants/alertTypes';

const SweetAlertBox = ({
  message, show, onConfirm, type, confirmButtonColor,
  showConfirmButton, title,
}) => {
  let imageUrl = '';
  imageUrl = imageUrls[type] ? imageUrls[type] : imageUrls.Warning;
  return (
    <SweetAlert
      confirmButtonColor={confirmButtonColor}
      icon="error"
      imageHeight="500"
      imageUrl={imageUrl}
      onConfirm={onConfirm}
      padding="3em"
      show={show}
      showConfirmButton={showConfirmButton}
      text={title && message}
      title={title || message}
      width="600"
    />
  );
};

SweetAlertBox.defaultProps = {
  show: false,
  confirmButtonColor: '',
  onConfirm() {},
  showConfirmButton: true,
  title: '',
};

SweetAlertBox.propTypes = {
  confirmButtonColor: PropTypes.string,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func,
  show: PropTypes.bool,
  showConfirmButton: PropTypes.bool,
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default SweetAlertBox;
