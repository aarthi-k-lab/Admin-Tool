import React from 'react';
import TaskPane from 'containers/Dashboard/TaskPane';
import Checklist from 'components/Checklist';
import './TasksAndChecklist.css';

const checklistItems = [
  {
    options: [
      { displayName: 'Yes', value: 'yes' },
      { displayName: 'No', value: 'no' },
    ],
    title: 'Are all documents received',
    type: 'radio',
  },
  {
    options: [
      { displayName: 'complete', value: 'complete' },
      { displayName: 'incomplete', value: 'incomplete' },
    ],
    title: 'Update Document Expiration Date',
    type: 'radio',
  },
  {
    options: [
      { displayName: 'complete', value: 'complete' },
      { displayName: 'incomplete', value: 'incomplete' },
    ],
    title: 'Update Document Checklist for Document Validation',
    type: 'radio',
  },
];

class TasksAndChecklist extends React.PureComponent {
  render() {
    return (
      <>
        <TaskPane />
        <Checklist checklistItems={checklistItems} styleName="checklist" title="Document Review" />
      </>
    );
  }
}

export default TasksAndChecklist;
