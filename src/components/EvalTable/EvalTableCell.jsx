import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './EvalTableCell.css';

const EvalTableCell = ({ value, styleProps, addLink }) => {
  const linkedSpan = (
    <Link styleName={styleProps} to="/frontend-evaluation">
      <span>{ value }</span>
    </Link>
  );
  const span = <span>{ value }</span>;
  if (addLink) {
    return linkedSpan;
  }
  return span;
};

EvalTableCell.PropTypes = {
  value: PropTypes.string.isRequired,
  styleProps: PropTypes.string.isRequired,
  addLink: PropTypes.bool.isRequired,
};

export default EvalTableCell;
