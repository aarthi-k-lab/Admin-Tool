import React from 'react';
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker';
import TextField from '@material-ui/core/TextField';
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
    const end = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
    this.state = {
      start,
      end,
    };
    this.applyCallback = this.applyCallback.bind(this);
  }

  applyCallback(fromDate, toDate) {
    const { triggerStartEndDate } = this.props;
    this.setState({
      start: fromDate,
      end: toDate,
    });
    const payload = {
      fromDate: fromDate.format('YYYY-MM-DD'),
      toDate: toDate.format('YYYY-MM-DD'),
    };
    triggerStartEndDate(payload);
  }

  render() {
    const { start, end } = this.state;
    const value = `${start.format('DD-MM-YYYY')
    }  to  ${
      end.format('DD-MM-YYYY')}`;
    const now = new Date();
    const CurrentDate = moment().startOf('month').format('DD');
    const fromDate = moment(new Date(now.getFullYear(),
      now.getMonth(), CurrentDate, 0, 0, 0, 0));
    const toDate = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
    const ranges = {
      'Today ': [moment(end), moment(end)],
      'Yesterday ': [
        moment(end).subtract(1, 'days'),
        moment(end).subtract(1, 'days'),
      ],
      'Last 7 Days': [moment(end).subtract(7, 'days'), moment(end)],
      'Last 30 Days ': [moment(end).subtract(1, 'months'), moment(end)],
    };
    const local = {
      format: 'DD-MM-YYYY',
      sundayFirst: false,
    };
    return (
      <>
        <div>
          <DateTimeRangeContainer
            applyCallback={this.applyCallback}
            end={toDate}
            local={local}
            ranges={ranges}
            start={fromDate}
          >
            <TextField
              placeholder="Enter text"
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
  triggerStartEndDate: PropTypes.func.isRequired,

};
const mapDispatchToProps = dispatch => ({
  triggerStartEndDate: stagerOperations.triggerStartEndDate(dispatch),
});

export default connect(null, mapDispatchToProps)(DatePicker);
