import React from 'react';
import renderer from 'react-test-renderer';
import Body from '.';

describe('<Body />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(<Body>content</Body>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
