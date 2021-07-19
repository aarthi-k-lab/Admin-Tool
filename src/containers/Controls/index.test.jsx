
import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './Controls';
import userdts from '../../models/Testmock/controls';

const defaultProps = {
  errorBanner: {
    errors: [],
    warnings: [],
  },
  lockCalculation: jest.fn(),
  onAssignToMeClick: jest.fn(),
  showCompleteMyReview: false,
  taskName: '',
  taskStatus: '',
  user: userdts,
  disableTrialTaskButton: false,
  disableValidation: false,
  dispositionCode: '',
  evalId: '',
  processId: '',
  showUpdateRemedy: false,
  validateDispositionTrigger: jest.fn(),
};

describe('<Controls />', () => {
  it('does not show \'EndShift\' and \'GetNext\'', () => {
    const wrapper = shallow(<TestHooks.Controls
      {...defaultProps}
    />);
    expect(wrapper.find('EndShift')).toHaveLength(0);
    expect(wrapper.find('GetNext')).toHaveLength(0);
  });

  it('show \'EndShift\' and \'GetNext\'', () => {
    const wrapper = shallow(<TestHooks.Controls
      {...defaultProps}
      showEndShift
      showGetNext
    />);
    expect(wrapper.find('EndShift')).toHaveLength(1);
    expect(wrapper.find('GetNext')).toHaveLength(1);
  });

  it('passes the props to the child components <GetNext />, <EndShift />, <Expand />', () => {
    const handleEndShift = jest.fn();
    const handleExpand = jest.fn();
    const wrapper = shallow(
      <TestHooks.Controls
        {...defaultProps}
        onEndShift={handleEndShift}
        onExpand={handleExpand}
        showEndShift
        showGetNext
      />,
    );
    expect(wrapper.find('GetNext').at(0).prop('disabled')).toBe(true);
    expect(wrapper.find('EndShift').at(0).prop('onClick')).toBeInstanceOf(Function);
    expect(wrapper.find('Expand').at(0).prop('onClick')).toBe(handleExpand);
  });
});
