import React from 'react';
import renderer from 'react-test-renderer';
import CollapseIcon from './CollapseIcon';
import LeftParentTasks from './LeftParentTasks';

const defaultProps = {
  updateChecklist: jest.fn(),
  resetDeleteTaskConfirmation: jest.fn(),
  shouldDeleteTask: false,
  onSubTaskClick: jest.fn(),
  handleShowDeleteTaskConfirmation: jest.fn(),
};
describe('<Task Components />', () => {
  it('CollapseIcon renders correctly', () => {
    const tree = renderer
      .create(<CollapseIcon {...defaultProps} direction="left" tasks={[{ _id: 1, failureReason: '', taskBlueprint: { name: '' } }]} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('LeftParentTasks renders correctly when expanded', () => {
    const tree = renderer
      .create(<LeftParentTasks
        {...defaultProps}
        isCollapsed={false}
        optionalTasks={[]}
        tasks={[{ _id: 1, failureReason: '', taskBlueprint: { name: '' } }]}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('LeftParentTasks renders correctly when collapsed', () => {
    const tree = renderer
      .create(<LeftParentTasks
        {...defaultProps}
        isCollapsed
        optionalTasks={[]}
        tasks={[{ _id: 1, failureReason: '', taskBlueprint: { name: '' } }]}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
