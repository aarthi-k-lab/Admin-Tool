import React from 'react';
import PropTypes from 'prop-types';
import SweetAlert from 'sweetalert2-react';

const SweetAlertBox = ({
  imageUrl, message, show, onConfirm,
}) => (
  <>
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
  </>
);

SweetAlertBox.defaultProps = {
  show: false,
};

SweetAlertBox.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

export default SweetAlertBox;
