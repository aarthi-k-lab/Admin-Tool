import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './StagerDocumentStatusCard';

describe('<StagerDocumentStatusCard />', () => {
  const onStatusCardClick = jest.fn();
  const data = { displayName: 'LegalFee' };
  it('shows StagerDocumentStatusCard', () => {
    const wrapper = shallow(
      <TestExports.StagerDocumentStatusCard data={data} onStatusCardClick={onStatusCardClick} />,
    );
    expect(wrapper.find('WithStyles(Paper)')).toHaveLength(1);
    expect(wrapper.find('WithStyles(Grid)')).toHaveLength(6);
    wrapper.find('WithStyles(Paper)').at(0).simulate('Click');
    expect(onStatusCardClick.mock.calls).toHaveLength(1);
  });
});