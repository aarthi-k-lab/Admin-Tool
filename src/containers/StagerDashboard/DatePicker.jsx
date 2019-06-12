import React from 'react';
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import CalendarIcon from '@material-ui/icons/DateRange';
import moment from 'moment';
import { connect } from 'react-redux';
import { operations as stagerOperations } from 'ducks/stager';
import PropTypes from 'prop-types';

class DatePicker extends React.PureComponent {
  constructor(props) {
    super(props);
    const now = new Date();
    const CurrentDate = moment().startOf('month').format('DD');
    const start = moment(new Date(now.getFullYear(), now.getMonth(), CurrentDate, 0, 0, 0, 0));
    const end = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0));
    this.state = {
      start,
      end,
    };
    this.applyCallback = this.applyCallback.bind(this);
  }

  applyCallback(fromDate, toDate) {
    const { triggerStartEndDate, getDashboardCounts } = this.props;
    this.setState({
      start: fromDate,
      end: toDate,
    });
    const payload = {
      fromDate: fromDate.format('YYYY-MM-DD HH:mm:ss'),
      toDate: toDate.format('YYYY-MM-DD HH:mm:ss'),
    };
    triggerStartEndDate(payload);
    getDashboardCounts();
  }

  render() {
    const { start, end } = this.state;
    const value = `${start.format('MM-DD-YYYY')
    }  to  ${
      end.format('MM-DD-YYYY')}`;
    const now = new Date();
    const CurrentDate = moment().startOf('month').format('DD');
    const fromDate = moment(new Date(now.getFullYear(),
      now.getMonth(), CurrentDate, 0, 0, 0, 0));
    const toDate = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0));
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
      'Month Till Date ': [moment(new Date(now.getFullYear(), now.getMonth(), CurrentDate, 0, 0, 0, 0)),
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
                    <IconButton style={{ padding: '4px', color: 'var(--grey-900)' }}>
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

DatePicker.propTypes = {
  getDashboardCounts: PropTypes.func.isRequired,
  triggerStartEndDate: PropTypes.func.isRequired,
};
const mapDispatchToProps = dispatch => ({
  triggerStartEndDate: stagerOperations.triggerStartEndDate(dispatch),
  getDashboardCounts: stagerOperations.getDashboardCounts(dispatch),
});

export default connect(null, mapDispatchToProps)(DatePicker);
