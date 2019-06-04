import React from 'react';
import PropTypes from 'prop-types';
import './WidgetComponent.css';

const WidgetComponent = (props) => {
  const {
    rightAppBar, rightAppBarSelected,
  } = props;
  return (
    <div styleName={rightAppBarSelected === 'customCommunicationLetter' ? 'right-app-bar-enlargedWidth' : 'right-app-bar'}>
      <div style={{ width: '100%' }}>
        <div styleName="comment-area-bottom">
          {
              rightAppBar.find(data => (
                data.id === rightAppBarSelected
              )).component
            }
        </div>
      </div>
    </div>
  );
};

WidgetComponent.defaultProps = {
  rightAppBar: [],
  rightAppBarSelected: '',
};

WidgetComponent.propTypes = {
  rightAppBar: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.element,
  })),
  rightAppBarSelected: PropTypes.string,
};


const TestHooks = {
  WidgetComponent,
};

export default WidgetComponent;
export { TestHooks };
