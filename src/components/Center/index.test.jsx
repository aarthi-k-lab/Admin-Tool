import React from 'react';
import renderer from 'react-test-renderer';
import Center from './Center';

const children = [<div key={1} />];
describe('<Center />', () => {
  test('snapshot test when disabled is false', () => {
    const tree = renderer
      .create(<Center>{children}</Center>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('snapshot test when disabled is true', () => {
    const tree = renderer
      .create(<Center disableExpand>{children}</Center>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
