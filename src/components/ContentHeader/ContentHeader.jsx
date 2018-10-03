import React from 'react';
import PropTypes from 'prop-types';
import GetNext from './GetNext';
import EndShift from './EndShift';
import './ContentHeader.css';
import Expand from './Expand';

const ContentHeader = ({
  disableGetNext,
  onEndShift,
  onExpand,
  onGetNext,
  showEndShift,
  showGetNext,
  title,
}) => {
  const getNext = <GetNext disabled={disableGetNext} onClick={onGetNext} />;
  const endShift = <EndShift onClick={onEndShift} />;
  const expand = <Expand onClick={onExpand} />;
  return (
    <header styleName="content-header">
      <h3 styleName="title">{title}</h3>
      <span styleName="spacer" />
      {showEndShift ? endShift : null}
      {showGetNext ? getNext : null}
      {expand}
    </header>
  );
};

ContentHeader.defaultProps = {
  disableGetNext: false,
  onEndShift: () => {},
  onExpand: () => {},
  onGetNext: () => {},
  title: 'FE Underwriter',
  showEndShift: false,
  showGetNext: false,
};

ContentHeader.propTypes = {
  disableGetNext: PropTypes.bool,
  onEndShift: PropTypes.func,
  onExpand: PropTypes.func,
  onGetNext: PropTypes.func,
  showEndShift: PropTypes.bool,
  showGetNext: PropTypes.bool,
  title: PropTypes.string,
};

export default ContentHeader;
