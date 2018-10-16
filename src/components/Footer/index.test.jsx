import React from 'react';
import renderer from 'react-test-renderer';
import Footer from '.';

describe('<Footer />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(<Footer />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
