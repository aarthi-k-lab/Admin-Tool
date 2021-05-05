import React from 'react';
import PropTypes from 'prop-types';
import './WidgetComponent.css';
import * as R from 'ramda';

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
      currentWidget, rightAppBar, inSearchPage,
    } = this.props;
    const selectedWidget = R.find(R.propEq('id', currentWidget))(rightAppBar);
    const component = R.propOr(null, 'component', selectedWidget);
    return component
        && (
        <div styleName={(inSearchPage && currentWidget === 'Comments') ? 'right-app-bar-search' : getSytles(currentWidget)}>
          <div style={{ width: '100%' }}>
            <div styleName="comment-area-bottom">
              {component}
            </div>
          </div>
        </div>
        );
  }
}

WidgetComponent.defaultProps = {
  inSearchPage: false,
  rightAppBar: [],
  currentWidget: '',
};

WidgetComponent.propTypes = {
  currentWidget: PropTypes.string,
  inSearchPage: PropTypes.bool,
  rightAppBar: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.element,
  })),
};


const TestHooks = {
  WidgetComponent,
};

export default WidgetComponent;
export { TestHooks };
