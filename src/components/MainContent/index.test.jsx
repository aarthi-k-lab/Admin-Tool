import React from 'react';
import renderer from 'react-test-renderer';
import MainContent from '.';

describe('<MainContent />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(<MainContent>content</MainContent>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
