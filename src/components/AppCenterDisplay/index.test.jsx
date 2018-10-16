import React from 'react';
import renderer from 'react-test-renderer';
import AppCenterDisplay from '.';

describe('<AppCenterDisplay />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(<AppCenterDisplay header="header">content</AppCenterDisplay>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
