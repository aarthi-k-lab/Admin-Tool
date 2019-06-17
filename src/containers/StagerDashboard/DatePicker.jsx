import React from 'react';
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import CalendarIcon from '@material-ui/icons/DateRange';
import moment from 'moment';
import DashboardModel from 'models/Dashboard';
import { connect } from 'react-redux';
import { selectors as stagerSelectors, operations as stagerOperations } from 'ducks/stager';
import PropTypes from 'prop-types';

class DatePicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.applyCallback = this.applyCallback.bind(this);
  }

  applyCallback(fromDate, toDate) {
    const {
      triggerStartEndDate, getDashboardCounts,
      getDashboardData, getActiveSearchTerm,
      getStagerValue, triggerStagerPageCount,
      getStagerPageCount,
    } = this.props;
    const stagerTablePageCount = DashboardModel.STAGER_TABLE_PAGE_COUNT;
    const pagepayload = {
      fromDate: fromDate.format('YYYY-MM-DD HH:mm:ss'),
      toDate: toDate.format('YYYY-MM-DD HH:mm:ss'),
    };
    const payload = {
      activeSearchTerm: getActiveSearchTerm,
      stager: getStagerValue,
    };
    const stagerPayload = {
      PageCount: 0,
      pageNo: 1,
      maxFetchCount: stagerTablePageCount,
      pageSize: getStagerPageCount.pageSize,
    };
    triggerStartEndDate(pagepayload);
    getDashboardCounts();
    triggerStagerPageCount(stagerPayload);
    getDashboardData(payload);
  }

  render() {
    const { getStagerStartEndDate } = this.props;
    const start = moment(getStagerStartEndDate.fromDate);
    const end = moment(getStagerStartEndDate.toDate);
    const value = `${start.format('MM-DD-YYYY')
    }  to  ${
      end.format('MM-DD-YYYY')}`;
    const now = new Date();
    const CurrentDate = moment().startOf('month').format('DD');
    const fromDate = moment(new Date(now.getFullYear(),
      now.getMonth(), CurrentDate, 0, 0, 0, 0));
    const toDate = moment(new Date(now.getFullYear(), now.getMonth(),
      now.getDate(), 23, 59, 0, 0));
    const customeDate = moment(
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
    );
    const ranges = {
      'Today ': [customeDate, end],
      'Yesterday ': [
        moment(customeDate).subtract(1, 'days'),
        moment(end).subtract(1, 'days'),
      ],
      'Last 7 Days': [moment(customeDate).subtract(7, 'days'), moment(end)],
      'Last 30 Days ': [moment(customeDate).subtract(1, 'months'), moment(end)],
      'Month To Date ': [moment(new Date(now.getFullYear(), now.getMonth(), CurrentDate, 0, 0, 0, 0)),
        moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0))],
    };
    const local = {
      format: 'MM-DD-YYYY',
      sundayFirst: false,
    };
    const maxDate = moment(end);
    return (
      <>
        <div>
          <DateTimeRangeContainer
            applyCallback={this.applyCallback}
            end={toDate}
            local={local}
            maxDate={maxDate}
            ranges={ranges}
            start={fromDate}
          >
            <TextField
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton style={{ color: 'var(--grey-900)' }}>
                      <CalendarIcon style={{ width: '18px', height: '18px' }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              style={{ cursor: 'pointer' }}
              type="text"
              value={value}
            />
          </DateTimeRangeContainer>
        </div>
      </>
    );
  }
}

DatePicker.defaultProps = {
  getStagerStartEndDate: [],
  getStagerPageCount: [],
};

DatePicker.propTypes = {
  getActiveSearchTerm: PropTypes.string.isRequired,
  getDashboardCounts: PropTypes.func.isRequired,
  getDashboardData: PropTypes.func.isRequired,
  getStagerPageCount: PropTypes.node,
  getStagerStartEndDate: PropTypes.node,
  getStagerValue: PropTypes.string.isRequired,
  triggerStagerPageCount: PropTypes.func.isRequired,
  triggerStartEndDate: PropTypes.func.isRequired,

};
const mapDispatchToProps = dispatch => ({
  triggerStartEndDate: stagerOperations.triggerStartEndDate(dispatch),
  getDashboardCounts: stagerOperations.getDashboardCounts(dispatch),
  getDashboardData: stagerOperations.getDashboardData(dispatch),
  triggerStagerPageCount: stagerOperations.triggerStagerPageCount(dispatch),

});

const mapStateToProps = state => ({
  getStagerStartEndDate: stagerSelectors.getStagerStartEndDate(state),
  getStagerValue: stagerSelectors.getStagerValue(state),
  getActiveSearchTerm: stagerSelectors.getActiveSearchTerm(state),
  tableData: stagerSelectors.getTableData(state),
  getStagerPageCount: stagerSelectors.getStagerPageCount(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(DatePicker);
