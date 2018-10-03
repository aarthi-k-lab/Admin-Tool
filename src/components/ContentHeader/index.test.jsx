import React from 'react';
import { shallow } from 'enzyme';
import ContentHeader from '.';

describe('<ContentHeader />', () => {
  test('contains <Expand />', () => {
    const wrapper = shallow(<ContentHeader />);
    expect(wrapper.exists('Expand')).toBeTruthy();
  });

  test('contains <GetNext />, <EndShift />', () => {
    const wrapper = shallow(<ContentHeader showEndShift showGetNext />);
    expect(wrapper.exists('GetNext')).toBeTruthy();
    expect(wrapper.exists('EndShift')).toBeTruthy();
  });

  test('displays the title', () => {
    const title = 'Fancy title';
    const wrapper = shallow(<ContentHeader title={title} />);
    expect(wrapper.text().includes(title)).toBeTruthy();
  });

  test('passes the props to the child components <GetNext />, <EndShift />, <Expand />', () => {
    const handleEndShift = jest.fn();
    const handleExpand = jest.fn();
    const handleGetNext = jest.fn();
    const wrapper = shallow(
      <ContentHeader
        disableGetNext
        onEndShift={handleEndShift}
        onExpand={handleExpand}
        onGetNext={handleGetNext}
        showEndShift
        showGetNext
        title="Fancy title"
      />,
    );
    expect(wrapper.find('GetNext').at(0).prop('onClick')).toBe(handleGetNext);
    expect(wrapper.find('GetNext').at(0).prop('disabled')).toBe(true);
    expect(wrapper.find('EndShift').at(0).prop('onClick')).toBe(handleEndShift);
    expect(wrapper.find('Expand').at(0).prop('onClick')).toBe(handleExpand);
  });
});
