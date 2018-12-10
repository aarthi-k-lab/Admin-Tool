import React from 'react';
import renderer from 'react-test-renderer';
import Center from './Center';

describe('<Center />', () => {
  test('snapshot test when disabled is false', () => {
    const tree = renderer
      .create(<Center />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('snapshot test when disabled is true', () => {
    const tree = renderer
      .create(<Center disableExpand />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
