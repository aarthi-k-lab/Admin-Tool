import React from 'react';
import ContentHeader from 'components/ContentHeader';
import Controls from 'containers/Controls';
import FullHeightColumn from 'components/FullHeightColumn';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import DashboardModel from 'models/Dashboard';
import './LandingPage.css';

class LandingPage extends React.PureComponent {
  renderTitle() {
    const { location } = this.props;
    return DashboardModel.getTitle(location.pathname);
  }

  render() {
    return (
      <>
        <ContentHeader title={this.renderTitle()}>
          <Controls
            showGetNext
          />
        </ContentHeader>
        <FullHeightColumn styleName="landing-page">
          <img alt="landing page placeholder" src="/static/img/landing-page-placeholder.png" />
          <span>We have something more to show here...still baking!!!</span>
        </FullHeightColumn>
      </>
    );
  }
}

LandingPage.defaultProps = {
  location: {
    pathname: '',
  },
};

LandingPage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

const TestHooks = {
  LandingPage,
};

export default withRouter(LandingPage);
export { TestHooks };
