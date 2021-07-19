import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './StagerTiles';

const defaultProps = {
  onStatusCardClick: jest.fn(),
  searchResponse: {
    loanNumber: '',
    titleType: '',
    titleValue: '',
  },
};
describe('<StagerTiles />', () => {
  const counts = [{
    displayName: 'COMPLETED',
    data: [
      {
        taskName: 'Stager-Escrow-Ordered',
        displayName: 'Escrow',
        searchTerm: 'EscrowCompleted',
        stagerTaskStatus: 'Completed',
        aboutToBreach: null,
        slaBreached: null,
        slaOk: null,
        slaDays: null,
        total: 157,
      },
      {
        taskName: 'Stager-LegalFee-Ordered',
        displayName: 'Legal Fee',
        searchTerm: 'LegalFeeCompleted',
        stagerTaskStatus: 'Completed',
        aboutToBreach: null,
        slaBreached: null,
        slaOk: null,
        slaDays: null,
        total: 32,
      },
      {
        taskName: 'Stager-Value-Ordered',
        displayName: 'Value',
        searchTerm: 'ValueCompleted',
        stagerTaskStatus: 'Completed',
        aboutToBreach: null,
        slaBreached: null,
        slaOk: null,
        slaDays: null,
        total: 7,
      },
    ],
  }];
  const tileName = 'Escrow';
  const tabName = 'Order';
  it('shows StagerTiles', () => {
    const wrapper = shallow(
      <TestExports.StagerTiles
        {...defaultProps}
        activeTab={tabName}
        activeTile={tileName}
        counts={[]}
        stagerTaskName={{ activeTile: tileName, activeTab: tabName }}
      />,
    );
    expect(wrapper.find('Loader')).toHaveLength(1);
    expect(wrapper.find('WithStyles(ForwardRef(Grid))')).toHaveLength(1);
    expect(wrapper.instance().isActiveCard(tileName, tabName)).toBe(true);
    expect(wrapper.instance().isActiveCard('Legal', tabName)).toBe(false);
  });
  it('shows StagerDashboard', () => {
    const wrapper = shallow(
      <TestExports.StagerTiles
        {...defaultProps}
        activeTab={tabName}
        activeTile={tileName}
        counts={counts}
      />,
    );
    expect(wrapper.find('WithStyles(ForwardRef(Grid))')).toHaveLength(7);
    expect(wrapper.find('StagerDocumentStatusCard')).toHaveLength(3);
  });
});
