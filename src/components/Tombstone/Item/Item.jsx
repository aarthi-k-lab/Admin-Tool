/* eslint-disable no-unused-vars */
import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import './Item.css';

const styleObj = {
  default: {
    wrapper: 'wrapper',
    item: 'item',
    title: 'title',
    content: 'content',
  },
};

function Item({
  content, title, Component, style, disableIcons,
}) {
  let contentStyle = 'content';
  if (title === 'Previous Disposition' && content.trim().toLowerCase() === 'send for qc review') {
    contentStyle = 'qCReviewContent';
  }
  return (
    <div styleName={R.pathOr('wrapper', [style, 'wrapper'], styleObj)}>
      <div styleName={R.pathOr('item', [style, 'item'], styleObj)}>
        <span styleName={R.pathOr('title', [style, 'title'], styleObj)}>{title}</span>
        <span styleName={R.pathOr(contentStyle, [style, 'content'], styleObj)}>{content}</span>
      </div>
      {!disableIcons ? Component : ''}
    </div>

  );
}

Item.defaultProps = {
  content: 'content',
  title: 'title',
  Component: null,
  style: {},
  disableIcons: false,
};

Item.propTypes = {
  Component: PropTypes.node,
  content: PropTypes.string,
  disableIcons: PropTypes.bool,
  style: PropTypes.shape({
    content: PropTypes.string,
    title: PropTypes.string,
  }),
  title: PropTypes.string,
};

export default Item;
