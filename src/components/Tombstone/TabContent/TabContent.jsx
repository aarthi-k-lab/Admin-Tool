import React from 'react';
import PropTypes from 'prop-types';
import './TabContent.css';


function TabContent({ value, index, children }) {
  return (
    <div
      hidden={value !== index}
      index={index}
      role="tabpanel"
      style={{ marginLeft: '1rem', overflow: 'auto', alignSelf: 'stretch' }}
      value={value}
    >
      <table styleName="tombstone-table" width="100%">
        <tbody>
          {children}
        </tbody>
      </table>

    </div>
  );
}

TabContent.defaultProps = {
  value: 0,
  index: 0,
  children: '',
};


TabContent.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number,
  value: PropTypes.number,
};

export default TabContent;
