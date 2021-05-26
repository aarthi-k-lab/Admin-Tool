import TextField from '@material-ui/core/TextField';
import { operations, selectors } from 'ducks/tasks-and-checklist';
import * as R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InputAdornment from '@material-ui/core/InputAdornment';
import { direction, getStyleName } from 'constants/incomeCalc/styleName';
import './TextFields.css';


class TextFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textFieldValue: null,
    };
    this.hasError = false;
    this.helperText = '';
  }

  static getDerivedStateFromProps(props) {
    const { value, checklistLoadStatus } = props;
    if (!R.equals(checklistLoadStatus, 'loading')) {
      return {
        textFieldValue: value,
      };
    }
    return null;
  }

  onCurrencyChange = (event) => {
    const { onChange } = this.props;
    const value = event.target.value && R.replace(/\d(?=(?:\d{3})+$)/g, '$&,', R.replace(/[^0-9.]/g, '', event.target.value.toString()));
    onChange({ target: { value } });
  }

  getAdornment = (additionalElements) => {
    const { additionalInfo } = this.props;
    if (additionalElements && R.contains('adornment', additionalElements)) {
      const { position, adornment } = additionalInfo;
      return R.equals(position, 'start')
        ? { startAdornment: <InputAdornment>{adornment}</InputAdornment> }
        : { endAdornment: <InputAdornment>{adornment}</InputAdornment> };
    }
    return null;
  };

  getProps(type, props) {
    const { additionalInfo } = this.props;
    const { placeholder, regex } = additionalInfo;
    const { textFieldValue } = this.state;
    let value = textFieldValue;
    if (regex && value) {
      const { expression, replaceWith, flag } = regex;
      value = R.replace(new RegExp(expression, flag), replaceWith, value.toString());
    }
    switch (type) {
      case 'currency': {
        return {
          ...props,
          inputProps: {
            style: { textAlign: 'right' },
          },
          value: value && R.replace(/\d(?=(?:\d{3})+$)/g, '$&,', value.toString()),
          onChange: this.onCurrencyChange,
        };
      }
      case 'multi-line': {
        const { columns, rows } = additionalInfo;
        return {
          ...props,
          rows,
          multiline: true,
          inputProps: {
            cols: columns,
          },
          value,
        };
      }
      case 'read-only': {
        return {
          ...props,
          inputProps: {
            type: 'number',
            min: '0',
          },
          value,
        };
      }
      default: return { ...props, placeholder, value };
    }
  }

  getControl(customType) {
    const {
      additionalInfo, disabled, failureReason,
      value, componentTitle, onBlur,
    } = this.props;
    const properties = this.getProps(customType, { value: value || '' });
    const {
      hasTitle, valuePosition, styleName, additionalElements, adornment,
      defaultValue,
    } = additionalInfo;
    const { textFieldValue } = this.state;
    const val = R.isNil(textFieldValue) ? defaultValue : textFieldValue;
    if (customType === 'read-only') {
      const readOnlyValue = additionalElements && additionalElements.includes('adornment')
        ? `${adornment} ${val}` : val;
      return (
        <div
          style={R.propOr(direction.left, valuePosition, direction)}
          styleName={getStyleName('textFields', styleName, 'div')}
        >
          {(
            <>
              <p styleName={getStyleName('textFields', styleName, 'value')}>{readOnlyValue || ''}</p>
              {hasTitle && <p styleName={getStyleName('textFields', styleName, 'title')}>{componentTitle}</p>}
            </>
          )}
        </div>
      );
    }
    const adornmentElement = this.getAdornment(additionalElements);
    const inputProps = getStyleName('textFields', styleName, 'inputProps');
    return (
      <div styleName={getStyleName('textFields', styleName, 'div')}>
        {hasTitle && (
        <div styleName={getStyleName('textFields', styleName, 'title')}>
          {componentTitle}
        </div>
        )}
        <TextField
          disabled={disabled}
          error={!R.isEmpty(failureReason)}
          inputProps={inputProps}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          InputProps={adornmentElement}
          size="small"
          {...properties}
          onBlur={e => onBlur(e)}
          onChange={this.handleTextChange}
          styleName={disabled ? 'disabled' : getStyleName('textFields', styleName, 'textField') || 'inc-text'}
          variant="outlined"
        />
      </div>
    );
  }

  handleTextChange = (event) => {
    const { onChange } = this.props;
    this.setState({ textFieldValue: event.target.value });
    onChange(event);
  }

  render() {
    const { additionalInfo } = this.props;
    const { customType } = additionalInfo;
    return (
      <>
        {this.getControl(customType)}
      </>
    );
  }
}

TextFields.defaultProps = {
  getDropDownOptions: [],
  error: '',
  value: '',
  additionalInfo: {
    type: 'text',
    mandatory: false,
  },
  title: '',
  failureReason: [],
  disabled: false,
  checklistLoadStatus: null,
};

TextFields.propTypes = {
  additionalInfo: PropTypes.string,
  checklistLoadStatus: PropTypes.string,
  componentTitle: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  failureReason: PropTypes.arrayOf({
    level: PropTypes.number,
    message: PropTypes.string,
  }),
  fetchDropDownOption: PropTypes.string.isRequired,
  getDropDownOptions: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    mail: PropTypes.string.isRequired,
  })),
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  renderChecklistItems: PropTypes.func.isRequired,
  source: PropTypes.string.isRequired,
  subTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
};

const mapDispatchToProps = dispatch => ({
  fetchDropDownOption: operations.fetchDropDownOptions(dispatch),
});

const mapStateToProps = state => ({
  getDropDownOptions: selectors.getDropDownOptions(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextFields);