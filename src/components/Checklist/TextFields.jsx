import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import { operations, selectors } from 'ducks/tasks-and-checklist';
import moment from 'moment-timezone';
import * as R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HTMLElements from '../../constants/componentTypes';
import './TextFields.css';


function getCurrentDate() {
  const date = new Date();
  const dateTime = moment(date).format('YYYY-MM-DD');
  return dateTime;
}

function getProps(type, props) {
  const {
    MULTILINE_TEXT, DATE, NUMBER, DROPDOWN,
  } = HTMLElements;
  switch (type) {
    case DATE: {
      return { ...props, inputProps: { type: 'date', max: getCurrentDate() } };
    }
    case MULTILINE_TEXT: {
      return {
        ...props, maxRows: 10, multiline: true, rows: 5,
      };
    }
    case NUMBER: {
      return {
        ...props,
        inputProps: {
          type: 'number',
          min: '0',
        },
      };
    }

    case DROPDOWN: {
      return {
        ...props,
        inputProps: {
          type: 'select',
          SelectProps: {
            native: true,
          },
        },
      };
    }
    default: return { ...props };
  }
}

class TextFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = '';
  }

  componentWillMount() {
    const { source, additionalInfo, fetchDropDownOption } = this.props;
    if (!R.isNil(source) && !R.isEmpty(source)) {
      fetchDropDownOption(source, additionalInfo);
    }
  }

  getDropDownOptions() {
    const { getDropDownOptions } = this.props;
    return (getDropDownOptions ? getDropDownOptions.map(option => (
      <option key={option.id} disabled={!(R.propOr(true, 'isEnabled', option))} value={option.userPrincipalName}>
        {option.displayName}
      </option>
    )) : null);
  }

  getControl(type) {
    const { DROPDOWN } = HTMLElements;
    const { title, ...other } = this.props;
    const properties = getProps(type, { ...other });
    return (type === DROPDOWN) ? (
      <TextField
        styleName="dropDownStyle"
        {...this.props}
        margin="dense"
        select
        SelectProps={{
          native: true,
          MenuProps: {
            styleName: 'dropDownMenuStyle',
          },
        }}
      >
        { this.getDropDownOptions() }
      </TextField>
    ) : (<TextField {...properties} />);
  }

  render() {
    const { type, title } = this.props;
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend" styleName="text-label">{title}</FormLabel>
        {this.getControl(type)}
      </FormControl>
    );
  }
}

TextFields.defaultProps = {
  getDropDownOptions: [],
};

TextFields.propTypes = {
  additionalInfo: PropTypes.string.isRequired,
  fetchDropDownOption: PropTypes.string.isRequired,
  getDropDownOptions: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    mail: PropTypes.string.isRequired,
  })),
  source: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

const mapDispatchToProps = dispatch => ({
  fetchDropDownOption: operations.fetchDropDownOptions(dispatch),
});

const mapStateToProps = state => ({
  getDropDownOptions: selectors.getDropDownOptions(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextFields);
