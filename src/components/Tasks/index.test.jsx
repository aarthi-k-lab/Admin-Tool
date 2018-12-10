import React from 'react';
import renderer from 'react-test-renderer';
import CollapseIcon from './CollapseIcon';
import LeftParentTasks from './LeftParentTasks';

describe('<Task Components />', () => {
  it('CollapseIcon renders correctly', () => {
    const tree = renderer
      .create(<CollapseIcon direction="left" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('LeftParentTasks renders correctly when expanded', () => {
    const tree = renderer
      .create(<LeftParentTasks isCollapsed={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('LeftParentTasks renders correctly when collapsed', () => {
    const tree = renderer
      .create(<LeftParentTasks isCollapsed />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
