import React from 'react';
import { shallow } from 'enzyme';
import OptionalTaskDetails from './OptionalTaskDetails';


describe('<OptionalTaskDetails />', () => {
  it('should render the OptionalTaskDetails component', () => {
    const tasks = [
      {
        id: '5f2d1f2787d90edadcfde4db',
        visibility: false,
        name: 'Reject Review',
        description: 'Reject Review',
        taskCode: 'REJRV',
        subTasks: [
          {
            _id: '5f2d1f2787d90e7c18fde4f1',
            assignedTo: [],
            state: 'in-progress',
            failureReason: '',
            taskBlueprintCode: 'REJRVW',
            taskBlueprint: {
              _id: '5e43f873f0c849d0eb9e2fd0',
              effectiveEndDate: '9999-12-31T23:59:59.999Z',
              name: 'Reject Review',
              description: 'Reject Review',
              taskCode: 'REJRVW',
              appCode: 'CMOD',
              effectiveStartDate: '2020-02-12T13:06:58.289Z',
              __v: 0,
            },
            processBlueprintCode: 'FEUW_v1.31',
            processInstance: '5f2d1f2787d90ed33bfde4d3',
            createdDate: '2020-08-07T09:30:15.556Z',
            appCode: 'CMOD',
            __v: 0,
            dependencyType: 'required',
            order: 0,
            visibility: true,
          },
        ],
      },
      {
        id: '5f2d1f2787d90ee9c3fde4d9',
        visibility: false,
        name: 'Miscellaneous',
        description: 'Miscellaneous',
        taskCode: 'MISC',
        subTasks: [
          {
            _id: '5f2d1f2787d90e0068fde4f6',
            assignedTo: [],
            state: 'in-progress',
            failureReason: '',
            taskBlueprintCode: 'MISCTSK',
            taskBlueprint: {
              _id: '5e43f873f0c84952109e2fdb',
              effectiveEndDate: '9999-12-31T23:59:59.999Z',
              name: 'Miscellaneous',
              description: 'Miscellaneous',
              taskCode: 'MISCTSK',
              appCode: 'CMOD',
              effectiveStartDate: '2020-02-12T13:06:58.330Z',
              __v: 0,
            },
            processBlueprintCode: 'FEUW_v1.31',
            processInstance: '5f2d1f2787d90ed33bfde4d3',
            createdDate: '2020-08-07T09:30:15.568Z',
            appCode: 'CMOD',
            __v: 0,
            dependencyType: 'required',
            order: 0,
            visibility: true,
          },
        ],
      },
    ];
    const props = {
      handleShowDeleteTaskConfirmation: jest.fn(),
      handleShowOptionalTasks: jest.fn(),
      resetDeleteTaskConfirmation: jest.fn(),
      tasks,
      shouldDeleteTask: false,
      updateChecklist: jest.fn(),
    };

    const wrapper = shallow(
      <OptionalTaskDetails {...props} />,
    );
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
  it('should call updateChecklist on AddTask click', () => {
    const tasks = [
      {
        id: '5f2d1f2787d90edadcfde4db',
        visibility: false,
        name: 'Reject Review',
        description: 'Reject Review',
        taskCode: 'REJRV',
        subTasks: [
          {
            _id: '5f2d1f2787d90e7c18fde4f1',
            assignedTo: [],
            state: 'in-progress',
            failureReason: '',
            taskBlueprintCode: 'REJRVW',
            taskBlueprint: {
              _id: '5e43f873f0c849d0eb9e2fd0',
              effectiveEndDate: '9999-12-31T23:59:59.999Z',
              name: 'Reject Review',
              description: 'Reject Review',
              taskCode: 'REJRVW',
              appCode: 'CMOD',
              effectiveStartDate: '2020-02-12T13:06:58.289Z',
              __v: 0,
            },
            processBlueprintCode: 'FEUW_v1.31',
            processInstance: '5f2d1f2787d90ed33bfde4d3',
            createdDate: '2020-08-07T09:30:15.556Z',
            appCode: 'CMOD',
            __v: 0,
            dependencyType: 'required',
            order: 0,
            visibility: true,
          },
        ],
      },
      {
        id: '5f2d1f2787d90ee9c3fde4d9',
        visibility: false,
        name: 'Miscellaneous',
        description: 'Miscellaneous',
        taskCode: 'MISC',
        subTasks: [
          {
            _id: '5f2d1f2787d90e0068fde4f6',
            assignedTo: [],
            state: 'in-progress',
            failureReason: '',
            taskBlueprintCode: 'MISCTSK',
            taskBlueprint: {
              _id: '5e43f873f0c84952109e2fdb',
              effectiveEndDate: '9999-12-31T23:59:59.999Z',
              name: 'Miscellaneous',
              description: 'Miscellaneous',
              taskCode: 'MISCTSK',
              appCode: 'CMOD',
              effectiveStartDate: '2020-02-12T13:06:58.330Z',
              __v: 0,
            },
            processBlueprintCode: 'FEUW_v1.31',
            processInstance: '5f2d1f2787d90ed33bfde4d3',
            createdDate: '2020-08-07T09:30:15.568Z',
            appCode: 'CMOD',
            __v: 0,
            dependencyType: 'required',
            order: 0,
            visibility: true,
          },
        ],
      },
    ];
    const props = {
      handleShowDeleteTaskConfirmation: jest.fn(),
      handleShowOptionalTasks: jest.fn(),
      resetDeleteTaskConfirmation: jest.fn(),
      tasks,
      shouldDeleteTask: false,
      updateChecklist: jest.fn(),
    };

    const wrapper = shallow(
      <OptionalTaskDetails {...props} />,
    );
    wrapper.find('WithStyles(AddTask)').at(0).simulate('click');
    expect(props.updateChecklist).toBeCalled();
  });
  it('should call handleShowDeleteTaskConfirmation on DeleteTask click', () => {
    const tasks = [
      {
        id: '5f2d1f2787d90edadcfde4db',
        visibility: false,
        name: 'Reject Review',
        description: 'Reject Review',
        taskCode: 'REJRV',
        subTasks: [
          {
            _id: '5f2d1f2787d90e7c18fde4f1',
            assignedTo: [],
            state: 'in-progress',
            failureReason: '',
            taskBlueprintCode: 'REJRVW',
            taskBlueprint: {
              _id: '5e43f873f0c849d0eb9e2fd0',
              effectiveEndDate: '9999-12-31T23:59:59.999Z',
              name: 'Reject Review',
              description: 'Reject Review',
              taskCode: 'REJRVW',
              appCode: 'CMOD',
              effectiveStartDate: '2020-02-12T13:06:58.289Z',
              __v: 0,
            },
            processBlueprintCode: 'FEUW_v1.31',
            processInstance: '5f2d1f2787d90ed33bfde4d3',
            createdDate: '2020-08-07T09:30:15.556Z',
            appCode: 'CMOD',
            __v: 0,
            dependencyType: 'required',
            order: 0,
            visibility: true,
          },
        ],
      },
      {
        id: '5f2d1f2787d90ee9c3fde4d9',
        visibility: false,
        name: 'Miscellaneous',
        description: 'Miscellaneous',
        taskCode: 'MISC',
        subTasks: [
          {
            _id: '5f2d1f2787d90e0068fde4f6',
            assignedTo: [],
            state: 'in-progress',
            failureReason: '',
            taskBlueprintCode: 'MISCTSK',
            taskBlueprint: {
              _id: '5e43f873f0c84952109e2fdb',
              effectiveEndDate: '9999-12-31T23:59:59.999Z',
              name: 'Miscellaneous',
              description: 'Miscellaneous',
              taskCode: 'MISCTSK',
              appCode: 'CMOD',
              effectiveStartDate: '2020-02-12T13:06:58.330Z',
              __v: 0,
            },
            processBlueprintCode: 'FEUW_v1.31',
            processInstance: '5f2d1f2787d90ed33bfde4d3',
            createdDate: '2020-08-07T09:30:15.568Z',
            appCode: 'CMOD',
            __v: 0,
            dependencyType: 'required',
            order: 0,
            visibility: true,
          },
        ],
      },
    ];
    const props = {
      handleShowDeleteTaskConfirmation: jest.fn(),
      handleShowOptionalTasks: jest.fn(),
      resetDeleteTaskConfirmation: jest.fn(),
      shouldDeleteTask: true,
      tasks,
      updateChecklist: jest.fn(),
    };

    const wrapper = shallow(
      <OptionalTaskDetails {...props} />,
    );
    wrapper.setState({ isTaskAdded: [{ mock: '' }, {}] });
    wrapper.find('WithStyles(DeleteTask)').at(0).simulate('click');
    expect(props.handleShowDeleteTaskConfirmation).toBeCalled();
  });
  it('should call handleShowOptionalTasks on Close click', () => {
    const tasks = [
      {
        id: '5f2d1f2787d90edadcfde4db',
        visibility: false,
        name: 'Reject Review',
        description: 'Reject Review',
        taskCode: 'REJRV',
        subTasks: [
          {
            _id: '5f2d1f2787d90e7c18fde4f1',
            assignedTo: [],
            state: 'in-progress',
            failureReason: '',
            taskBlueprintCode: 'REJRVW',
            taskBlueprint: {
              _id: '5e43f873f0c849d0eb9e2fd0',
              effectiveEndDate: '9999-12-31T23:59:59.999Z',
              name: 'Reject Review',
              description: 'Reject Review',
              taskCode: 'REJRVW',
              appCode: 'CMOD',
              effectiveStartDate: '2020-02-12T13:06:58.289Z',
              __v: 0,
            },
            processBlueprintCode: 'FEUW_v1.31',
            processInstance: '5f2d1f2787d90ed33bfde4d3',
            createdDate: '2020-08-07T09:30:15.556Z',
            appCode: 'CMOD',
            __v: 0,
            dependencyType: 'required',
            order: 0,
            visibility: true,
          },
        ],
      },
      {
        id: '5f2d1f2787d90ee9c3fde4d9',
        visibility: false,
        name: 'Miscellaneous',
        description: 'Miscellaneous',
        taskCode: 'MISC',
        subTasks: [
          {
            _id: '5f2d1f2787d90e0068fde4f6',
            assignedTo: [],
            state: 'in-progress',
            failureReason: '',
            taskBlueprintCode: 'MISCTSK',
            taskBlueprint: {
              _id: '5e43f873f0c84952109e2fdb',
              effectiveEndDate: '9999-12-31T23:59:59.999Z',
              name: 'Miscellaneous',
              description: 'Miscellaneous',
              taskCode: 'MISCTSK',
              appCode: 'CMOD',
              effectiveStartDate: '2020-02-12T13:06:58.330Z',
              __v: 0,
            },
            processBlueprintCode: 'FEUW_v1.31',
            processInstance: '5f2d1f2787d90ed33bfde4d3',
            createdDate: '2020-08-07T09:30:15.568Z',
            appCode: 'CMOD',
            __v: 0,
            dependencyType: 'required',
            order: 0,
            visibility: true,
          },
        ],
      },
    ];
    const props = {
      handleShowDeleteTaskConfirmation: jest.fn(),
      handleShowOptionalTasks: jest.fn(),
      resetDeleteTaskConfirmation: jest.fn(),
      shouldDeleteTask: true,
      tasks,
      updateChecklist: jest.fn(),
    };

    const wrapper = shallow(
      <OptionalTaskDetails {...props} />,
    );
    wrapper.setState({ isTaskAdded: [{ mock: '' }, {}] });
    wrapper.find('Close').at(0).simulate('click');
    expect(props.handleShowOptionalTasks).toBeCalled();
  });
});
