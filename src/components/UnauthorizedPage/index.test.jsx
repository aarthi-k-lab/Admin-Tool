import React from 'react';
import renderer from 'react-test-renderer';
import UnauthorizedPage from '.';

describe('<UnauthorizedPage />', () => {
  test('snapshot test', () => {
    const location = { search: '' };
    const tree = renderer
      .create(<UnauthorizedPage location={location} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});