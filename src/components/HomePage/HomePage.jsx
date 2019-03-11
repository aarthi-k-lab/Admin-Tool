import React from 'react';
import FullHeightColumn from 'components/FullHeightColumn';
import './HomePage.css';

function HomePage() {
  return (
    <FullHeightColumn styleName="home-page">
      <img alt="home page placeholder" src="/static/img/landing-page-placeholder.png" />
      <span>We have something more to show here...still baking!!!</span>
    </FullHeightColumn>
  );
}

export default HomePage;
