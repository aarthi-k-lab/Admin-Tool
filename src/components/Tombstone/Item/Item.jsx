import React from 'react';
import PropTypes from 'prop-types';

import './Item.css';

function Item({ content, title }) {
  let contentStyle = 'content';
  if (title === 'Previous Disposition' && content.trim().toLowerCase() === 'send for qc review') {
    contentStyle = 'qCReviewContent';
  }
  return (
    <div styleName="item">
      <span styleName="title">{title}</span>
      <span styleName={contentStyle}>{content}</span>
    </div>
  );
}

Item.defaultProps = {
  content: 'content',
  title: 'title',
};

Item.propTypes = {
  content: PropTypes.string,
  title: PropTypes.string,
};

export default Item;
