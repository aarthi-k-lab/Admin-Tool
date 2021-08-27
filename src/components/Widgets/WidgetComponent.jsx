import React from 'react';
import PropTypes from 'prop-types';
import './WidgetComponent.css';
import * as R from 'ramda';

const getSytles = (selectedApp) => {
  switch (selectedApp) {
    case 'customCommunicationLetter':
    case 'FHLMC':
      return 'right-app-bar-enlargedWidth';
    case 'History': return '';
    default: return 'right-app-bar';
  }
};

class WidgetComponent extends React.PureComponent {
  render() {
    const {
      currentWidget, rightAppBar, page,
    } = this.props;
    const selectedWidget = R.find(R.propEq('id', currentWidget))(rightAppBar);
    let component = R.propOr(null, 'component', selectedWidget);
    component = component && R.assocPath(['props', 'page'], page, component);
    return component
      && (
        <div styleName={(R.equals(page, 'SEARCH_LOAN') && currentWidget === 'Comments') ? 'right-app-bar-search' : getSytles(currentWidget)}>
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
  page: '',
  rightAppBar: [],
  currentWidget: '',
};

WidgetComponent.propTypes = {
  currentWidget: PropTypes.string,
  page: PropTypes.string,
  rightAppBar: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.element,
  })),
};


const TestHooks = {
  WidgetComponent,
};

export default WidgetComponent;
export { TestHooks };
