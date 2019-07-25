import React from 'react';
import renderer from 'react-test-renderer';
import LeftTaskPane from './LeftTaskPane';

describe('<LeftTaskPane Components />', () => {
  it('LeftTaskPane renders correctly', () => {
    const tree = renderer
      .create(<LeftTaskPane historicalCheckListData={[]} optionalTasks={[]} tasks={[]} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
