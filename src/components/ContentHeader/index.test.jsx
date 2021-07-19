import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './ContentHeader';

const defaultProps = {
  azureSearchToggle: false,
  features: [],
  handleToggle: jest.fn(),
  isUtilGroupPresent: false,
  toggleButton: false,
};
describe('<ContentHeader />', () => {
  test('displays the onAutoSave function', () => {
    const checklistTemplateName = 'PROC';
    const handleClick = jest.fn();
    const showAddButton = true;
    const group = 'POSTMOD';
    const title = 'Fancy title';
    const onAutoSave = jest.fn();
    const onEndShift = jest.fn();
    const enableGetNext = false;
    const evalId = '3546574';
    const isAssigned = true;
    const wrap = shallow(
      <TestExports.ContentHeader
        {...defaultProps}
        checklistTemplateName={checklistTemplateName}
        enableGetNext={enableGetNext}
        evalId={evalId}
        group={group}
        handleClick={handleClick}
        isAssigned={isAssigned}
        onAutoSave={onAutoSave}
        onEndShift={onEndShift}
        showAddButton={showAddButton}
        title={title}
      />,
    );
    expect(wrap.find('WithStyles(ForwardRef(Tooltip))')).toHaveLength(1);
    wrap.find('Link').at(0).simulate('click');
    expect(onAutoSave).toBeCalledTimes(1);
  });
  it('should call the title', () => {
    const checklistTemplateName = 'PROC';
    const handleClick = jest.fn();
    const showAddButton = true;
    const group = 'POSTMOD';
    const title = 'Fancy title';
    const onAutoSave = jest.fn();
    const onEndShift = jest.fn();
    const enableGetNext = false;
    const evalId = '3546574';
    const isAssigned = true;
    const wrap = shallow(
      <TestExports.ContentHeader
        {...defaultProps}
        checklistTemplateName={checklistTemplateName}
        enableGetNext={enableGetNext}
        evalId={evalId}
        group={group}
        handleClick={handleClick}
        isAssigned={isAssigned}
        onAutoSave={onAutoSave}
        onEndShift={onEndShift}
        showAddButton={showAddButton}
        title={title}
      />,
    );
    expect(wrap.find('WithStyles(ForwardRef(Tooltip))')).toHaveLength(1);
    wrap.find('Link').at(0).simulate('click');
    expect(onAutoSave).toBeCalled();
  });
});
