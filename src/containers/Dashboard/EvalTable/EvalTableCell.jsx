import React from 'react';
import PropTypes from 'prop-types';
import './EvalTableCell.css';

const EvalTableCell = ({ value, styleProps }) => {
  const span = (
    <span styleName={styleProps}>
      { value }
    </span>
  );
  return span;
};

EvalTableCell.PropTypes = {
  value: PropTypes.string.isRequired,
  styleProps: PropTypes.string.isRequired,
  addLink: PropTypes.bool.isRequired,
};

export default EvalTableCell;
