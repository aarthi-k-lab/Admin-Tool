import React from 'react';
import renderer from 'react-test-renderer';
import FullHeightColumn from '.';

describe('<FullHeightColumn />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(<FullHeightColumn className="class1 class2">content</FullHeightColumn>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
