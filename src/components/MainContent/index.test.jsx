import React from 'react';
import renderer from 'react-test-renderer';
import MainContent from '.';

let defaultProps ={
  expandView : false,
}
describe('<MainContent />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(<MainContent {...defaultProps}>content </MainContent>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
