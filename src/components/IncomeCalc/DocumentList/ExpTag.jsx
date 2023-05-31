import React from 'react';
import PropTypes from 'prop-types';

function ExpTag(props) {
  const { expDate } = props;
  let expTag = false;
  if (expDate) {
    const currentDate = new Date();
    const expiryDate = new Date(expDate);
    currentDate.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    expTag = currentDate > expiryDate;
  }
  return (
    <>
      {
            expTag ? (
              <span
                style={{
                  backgroundColor: 'orange',
                  padding: '2px 5px',
                  borderRadius: 3,
                  color: '#fff',
                  marginRight: 8,
                }}
              >
            EXP
              </span>
            ) : null
        }
    </>
  );
}
ExpTag.propTypes = {
  expDate: PropTypes.string.isRequired,
};

export default ExpTag;
