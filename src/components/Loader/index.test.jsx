import React from 'react';
import renderer from 'react-test-renderer';
import Loader from '.';

describe('<Loader />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(<Loader>content</Loader>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
