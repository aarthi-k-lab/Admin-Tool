import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import Item from './Item';
import './Tombstone.css';

function Tombstone({ items, onOpenWindow, onShowMore }) {
  return (
    <section styleName="tombstone">
      {Tombstone.getItems(items)}
      <div styleName="more-icon-button">
        <IconButton onClick={onShowMore}>
          <MoreIcon styleName="more-icon" />
        </IconButton>
      </div>
      <div styleName="spacer" />
      <IconButton onClick={onOpenWindow}>
        <OpenInNewIcon styleName="icon" />
      </IconButton>
    </section>
  );
}

Tombstone.getItems = function getItems(items) {
  return items.map(({ content, title }) => (
    <Item key={title} content={content} title={title} />
  ));
};

Tombstone.defaultProps = {
  items: [
    {
      title: 'Loan #',
      content: '67845985',
    },
    {
      title: 'Investors',
      content: 'FHA',
    },
    {
      title: 'Title',
      content: 'Content',
    },
  ],
  onOpenWindow: () => {},
  onShowMore: () => {},
};

Tombstone.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
  ),
  onOpenWindow: PropTypes.func,
  onShowMore: PropTypes.func,
};

export default Tombstone;
