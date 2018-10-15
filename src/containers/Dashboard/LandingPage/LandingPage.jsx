import React from 'react';
import ContentHeader from 'components/ContentHeader';
import Controls from 'containers/Controls';
import FullHeightColumn from 'components/FullHeightColumn';
import './LandingPage.css';

class LandingPage extends React.PureComponent {
  render() {
    return (
      <>
        <ContentHeader title="">
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

export default LandingPage;
