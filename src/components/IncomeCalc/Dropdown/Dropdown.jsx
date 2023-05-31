import { operations, selectors } from 'ducks/tasks-and-checklist';
import * as R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import './Dropdown.css';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import CreateSelect from 'components/IncomeCalc/CreateSelect';
import { getStyleName } from 'constants/incomeCalc/styleName';

const REGEX = {
  alphanumeric: {
    string: '^([0-9]|[a-z]|[A-Z])+([0-9a-zA-Z]*)$',
    helperText: 'Please enter alphanumeric value',
  },
  numeric: {
    string: '^[0-9]+$',
    helperText: 'Please enter numeric value',
  },
};

function getRegexData(regexType) {
  return REGEX[regexType];
}

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 2,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 14,
    minWidth: '6rem',
    padding: '4px 26px 5px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 2,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);


class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropDownValue: null,
    };
    this.hasError = false;
    this.helperText = '';
  }

  static getDerivedStateFromProps(props) {
    const { value, checklistLoadStatus } = props;
    if (!R.equals(checklistLoadStatus, 'loading')) {
      return {
        dropDownValue: value,
      };
    }
    return null;
  }

  onDropDownChangeHandler = (event) => {
    const { onChange } = this.props;
    this.setState({ dropDownValue: event.target.value });
    onChange(event);
  }

  getDropDownOptions() {
    const { additionalInfo: { options } } = this.props;
    return options && options.map(option => (
      <MenuItem disabled={option.disabled} value={option.value}>
        {option.displayName}
      </MenuItem>
    ));
  }

  getControl() {
    const {
      additionalInfo:
      {
        regex: regexType,
        options,
        styleName,
      },
      missing, disabled,
    } = this.props;
    const { dropDownValue } = this.state;
    const value = dropDownValue;
    if (regexType) {
      const { string: regexString, helperText } = getRegexData(regexType);
      if (missing || (regexString && value && !new RegExp(regexString).test(value))) {
        this.hasError = true;
        this.helperText = missing ? 'Please enter some value' : helperText;
      } else {
        this.hasError = false;
        this.helperText = null;
      }
    }
    const defaultValue = options && R.equals(R.prop('disabled', R.head(options)), true) ? R.prop('value', R.head(options)) : null;
    return (
      <Select
        disabled={disabled}
        displayEmpty
        id="demo-simple-select-outlined"
        input={<BootstrapInput />}
        label="Age"
        labelId="demo-simple-select-outlined-label"
        onChange={this.onDropDownChangeHandler}
        styleName={getStyleName('dropDown', styleName, 'select')}
        value={value || defaultValue}
      >
        {this.getDropDownOptions()}
      </Select>
    );
  }

  render() {
    const {
      title, additionalInfo,
    } = this.props;
    const { customType, styleName } = additionalInfo;
    if (R.equals(customType, 'create-select')) {
      return <CreateSelect {...this.props} />;
    }

    return (
      <div styleName={getStyleName('dropDown', styleName, 'dropdown-sect')}>
        {R.propOr(true, 'hasTitle', additionalInfo)
        && <div styleName={getStyleName('dropDown', styleName, 'title')}>{title}</div>}
        <div styleName={getStyleName('dropDown', styleName, 'dropdown')}>
          {this.getControl()}
        </div>
      </div>
    );
  }
}

Dropdown.defaultProps = {
  dropDownOptions: [],
  missing: false,
  value: '',
  disabled: false,
  additionalInfo: {
    type: 'text',
    mandatory: false,
    hasTitle: true,
  },
  checklistLoadStatus: null,
};

Dropdown.propTypes = {
  additionalInfo: PropTypes.string,
  checklistLoadStatus: PropTypes.string,
  disabled: PropTypes.bool,
  dropDownOptions: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string,
    value: PropTypes.string,
  })),
  fetchDropDownOption: PropTypes.string.isRequired,
  missing: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  renderChildren: PropTypes.func.isRequired,
  source: PropTypes.string.isRequired,
  subTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
};

const mapDispatchToProps = dispatch => ({
  fetchDropDownOption: operations.fetchDropDownOptions(dispatch),
});

const mapStateToProps = state => ({
  dropDownOptions: selectors.getDropDownOptions(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dropdown);
