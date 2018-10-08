const tasksObj = [
  {
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
  },
  {
    taskName: 'Tax Transcript Review',
    completed: true,
    subTasks: [
      {
        taskName: 'Order Tax Transcript',
        completed: true,
      },
      {
        taskName: 'Receive Tax Transcript',
        completed: true,
      },
    ],
  },
  {
    taskName: 'Application Review',
    failure: true,
    errorName: 'Error in Subtask',
    subTasks: [
      {
        taskName: 'Reason for Delinquency',
      },
      {
        taskName: 'Property Occupancy Status',
        failure: true,
        errorName: 'Documents not found!',
      },
    ],
  },
  {
    taskName: 'Income Verification',
  },
  {
    taskName: 'Expense Verification',
  },
  {
    taskName: 'Review Unemployment Plan',
  },
  {
    taskName: 'Rejection Review',
  },
];

export default tasksObj;
