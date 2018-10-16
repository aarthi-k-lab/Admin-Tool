import React from 'react';
import renderer from 'react-test-renderer';
import AppContainer from '.';

describe('<AppContainer />', () => {
  test('snapshot test with footer', () => {
    const tree = renderer
      .create(<AppContainer>content</AppContainer>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('snapshot test without footer', () => {
    const tree = renderer
      .create(<AppContainer hideFooter>content</AppContainer>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
