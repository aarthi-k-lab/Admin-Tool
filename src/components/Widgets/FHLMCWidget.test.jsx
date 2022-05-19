import React from 'react';
import { shallow } from 'enzyme';
import { FHLMCWidget } from './FHLMCWidget';
import SweetAlertBox from 'components/SweetAlertBox';
import FHLMCDataInsight from '../../containers/Dashboard/FhlmcResolve/FHLMCDataInsight';

const defaultProps = {
  getCancellationReasonsData: {},
  cancellationReasons: [],
  selectedCancellationReason: '',
  setSelectedCancellationReasonData: {},
  clearCancellationReasons: {},
  populateInvestorDropdown: jest.fn(),
  closeSweetAlert: jest.fn(),
  handleClose: jest.fn(),
  investorEvents: [''],
  resultOperation: {},
  isWidget: true,
  portfolioCode: 'FHLMC',
  selectedRequestType: 'DraftReq',
  submitCases: [],
  message: '',
  SweetAlertBox,
  resultOperation: {
    status: '',
    level: '',
    type: '',
    message: '',
  },
  eligibleData: 'Ineligible',
}

describe('<FHLMCWidget />', () => {
  let shallowWrapper;
  beforeEach(() => {
    shallowWrapper = shallow(<FHLMCWidget {...defaultProps} />);
  });

  it('Find FHLMC Data insight component', () => {
    expect(shallowWrapper.find(FHLMCDataInsight).length).toBe(1);
  });

  it('Find Sweet Alert', () => {
    expect(shallowWrapper.find(SweetAlertBox).length).toBe(1);
  });

})