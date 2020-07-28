import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './ContentHeader';


describe('<ContentHeader />', () => {
  test('displays the onAutoSave function', () => {
    const children = null;
    const checklistTemplateName = 'PROC';
    const handleClick = jest.fn();
    const showAddButton = true;
    const group = 'POSTMOD';
    const title = 'Fancy title';
    const onAutoSave = jest.fn();
    const onEndShift = jest.fn();
    const enableGetNext = jest.fn();
    const evalId = '3546574';
    const isAssigned = true;
    const wrap = shallow(
      <TestExports.ContentHeader
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
    expect(wrap.find('WithStyles(Tooltip)')).toHaveLength(1);
    wrap.find('Link').at(0).simulate('click');
    expect(onAutoSave).toBeCalledTimes(0);
  });
  it('should call the title', () => {
    const children = null;
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
    expect(wrap.find('WithStyles(Tooltip)')).toHaveLength(1);
    wrap.find('Link').at(0).simulate('click');
    expect(onAutoSave).toBeCalled();
    console.log(wrap.debug());
  });
});
