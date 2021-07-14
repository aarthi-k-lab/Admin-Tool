import React from 'react';
import PropTypes from 'prop-types';
import './WidgetComponent.css';

const getSytles = (selectedApp) => {
  switch (selectedApp) {
    case 'customCommunicationLetter': return 'right-app-bar-enlargedWidth';
    case 'History': return '';
    default: return 'right-app-bar';
  }
};

class WidgetComponent extends React.PureComponent {
  render() {
    const {
      rightAppBarSelected, rightAppBar, inSearchPage,
    } = this.props;
    return (
      <div styleName={(inSearchPage && rightAppBarSelected === 'Comments') ? 'right-app-bar-search' : getSytles(rightAppBarSelected)}>
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
  }
}

WidgetComponent.defaultProps = {
  inSearchPage: false,
  rightAppBar: [],
  rightAppBarSelected: '',
};

WidgetComponent.propTypes = {
  inSearchPage: PropTypes.bool,
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
