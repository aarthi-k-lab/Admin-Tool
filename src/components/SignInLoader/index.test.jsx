import React from 'react';
import renderer from 'react-test-renderer';
import SignInLoader from '.';

describe('<SignInLoader />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(<SignInLoader />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
