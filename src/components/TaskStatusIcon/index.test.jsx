import React from 'react';
import renderer from 'react-test-renderer';
import TaskStatusIcon from './TaskStatusIcon';

describe('<TaskStatusIcon />', () => {
  const task = {
    taskName: 'Document and Income Type Verification',
    subTasks: [
      {
        taskName: 'Document Review',
      },
      {
        taskName: 'Choose income type',
        completed: true,
      },
      {
        taskName: 'Suspicious Activity Review',
      },
    ],
  };

  it('TaskStatusIcon renders correctly', () => {
    const tree = renderer
      .create(<TaskStatusIcon
        isSubTask={false}
        task={task}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
