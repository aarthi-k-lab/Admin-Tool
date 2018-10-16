import React from 'react';
import renderer from 'react-test-renderer';
import UnauthorizedAppHeader from '.';

describe('<UnauthorizedAppHeader />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(<UnauthorizedAppHeader />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
