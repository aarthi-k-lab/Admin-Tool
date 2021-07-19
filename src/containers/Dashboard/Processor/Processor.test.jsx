import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './Processor';

const defaultProps = {
  history: [],
  onSelect: jest.fn(),
  onSubmitEval: jest.fn(),
  clearEvalResponse: jest.fn(),
  tableData: [
    {
      loanNumber: '',
      pid: '',
      evalId: '',
      statusMessage: '',
    },
  ],
  user: {},
};

describe('<Processor />', () => {
  const { Processor } = TestHooks;
  it('doesnt shows the loader  in Processor component', () => {
    const wrapper = shallow(<Processor {...defaultProps} inProgress={false} />);
    expect(wrapper.find('Loader')).toHaveLength(0);
  });
  it('shows Loader in progress in processor component ', () => {
    const wrapper = shallow(<Processor {...defaultProps} inProgress />);
    expect(wrapper.find('Loader')).toHaveLength(1);
  });
  it('should render download  button', () => {
    const wrapper = shallow(<Processor {...defaultProps} />);
    expect(wrapper.find('Link')).toHaveLength(1);
    expect(wrapper.find('#download_btn')).toHaveLength(1);
    expect(wrapper.find('CSVLink')).toHaveLength(1);
    expect(wrapper.find('SaveAltIcon')).toHaveLength(1);
  });
  it('should render something went wrong message in failure scenario', () => {
    const wrapper = shallow(<Processor {...defaultProps} />);
    expect(wrapper.find('#message')).toHaveLength(1);
    wrapper.instance().setState({ hasError: true });
    expect(wrapper.find('span')).toHaveLength(2);
    const element = wrapper.find('span').get(1).props.children;
    expect(element).toBe('We are experiencing some issues. Please try after some time.');
  });
  it('should render eval processed in success scenario', () => {
    const tableData = [
      {
        loanNumber: '', pid: '', evalId: '', statusMessage: 'Successful',
      },
    ];
    let evalProcessed = 0;
    tableData.map((value) => {
      if (value.statusMessage === 'Successful') evalProcessed += 1;
      return null;
    });
    const wrapper = shallow(<Processor {...defaultProps} tableData={tableData} />);
    expect(wrapper.find('#message')).toHaveLength(1);
    wrapper.instance().setState({ hasError: false });
    expect(wrapper.find('span')).toHaveLength(2);
    wrapper.instance().getMessage();
    expect(wrapper.find('span').get(1).props.children).toBe(`${evalProcessed} Evals have been processed.`);
  });
  it('should render notepad area and the submit button should be disabled in case of invalid evalid', () => {
    const wrapper = shallow(<Processor {...defaultProps} />);
    expect(wrapper.find('#notepad')).toHaveLength(1);
    expect(wrapper.find('div')).toHaveLength(8);
    wrapper.find('#loanNumbers').simulate('change', { target: { value: '123ds' } });
    expect(wrapper.instance().state.isDisabled).toBe(true);
  });
  it('should render notepad area and the submit button should be enabled in case of valid evalid', () => {
    const wrapper = shallow(<Processor {...defaultProps} />);
    expect(wrapper.find('#notepad')).toHaveLength(1);
    expect(wrapper.find('div')).toHaveLength(8);
    wrapper.find('#loanNumbers').simulate('change', { target: { value: '123456' } });
    expect(wrapper.instance().state.isDisabled).toBe(false);
  });
  it('should submit the eval case ids', () => {
    const onSubmitEval = jest.fn();
    const wrapper = shallow(<Processor {...defaultProps} onSubmitEval={onSubmitEval} />);
    expect(wrapper.find('#submit')).toHaveLength(1);
    wrapper.instance().setState({ evalIds: '123456' });
    wrapper.find('#submit').simulate('click');
    wrapper.instance().handleSubmit();
    expect(onSubmitEval).toHaveBeenCalled();
  });
  it('should show some error when submit button is click for invalid eval Ids', () => {
    const onFailedLoanValidation = jest.fn();
    const onSubmitEval = jest.fn();
    const wrapper = shallow(<Processor
      {...defaultProps}
      onFailedLoanValidation={onFailedLoanValidation}
      onSubmitEval={onSubmitEval}
    />);
    expect(wrapper.find('#submit')).toHaveLength(1);
    wrapper.instance().setState({ evalIds: '123abc' });
    wrapper.find('#submit').simulate('click');
    wrapper.instance().handleSubmit();
    expect(onFailedLoanValidation).toHaveBeenCalled();
    expect(onSubmitEval).not.toHaveBeenCalled();
  });
  it('should render table data', () => {
    const wrapper = shallow(<Processor {...defaultProps} />);
    expect(wrapper.find('div')).toHaveLength(8);
    expect(wrapper.find('#data')).toHaveLength(1);
    expect(wrapper.find('ReactTable')).toHaveLength(1);
  });
  it('should render user notification box', () => {
    const resultOperation = { status: 'abc', level: 'success' };
    const wrapper = shallow(<Processor {...defaultProps} resultOperation={resultOperation} />);
    expect(wrapper.find('UserNotification')).toHaveLength(1);
  });
});
