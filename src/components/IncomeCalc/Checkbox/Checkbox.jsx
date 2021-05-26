import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import * as R from 'ramda';
import './Checkbox.css';

function CheckBox({
  options,
  title,
  additionalInfo,
  value,
  source,
  onChangeMultipleBox,
  disabled,
}) {
  const [checkboxValue, setCheckboxValue] = useState(value);
  const { styleName, hasTitle, customType } = additionalInfo;
  const onChangeCheckboxHandler = (e) => {
    setCheckboxValue(e.target.checked);
    onChangeMultipleBox({ target: { value: e.target.checked } });
  };

  const onChangeMultipleCheck = (event) => {
    onChangeMultipleBox({
      target: {
        value: event.target.checked,
      },
    });
  };

  if (R.equals(source, 'value') || R.equals(customType, 'single')) {
    return (
      <Box style={{ display: 'flex', alignItems: 'center' }} styleName={styleName || ''}>
        <Checkbox checked={R.equals(checkboxValue, true)} disabled={disabled} onChange={onChangeCheckboxHandler} styleName="radio-control-bubble" />
        {hasTitle && <Typography style={{ paddingLeft: '0.5rem' }}>{title}</Typography>}
      </Box>
    );
  }
  return (
    <>
      {hasTitle && <Typography component="legend" styleName="radio-control-label">{title}</Typography>}
      {
          options.map(({
            displayName, value: checkValue,
          }) => (
            <div key={displayName} style={{ display: 'flex', alignItems: 'center', marginLeft: '1.5rem' }}>
              <Checkbox
                checked={R.contains(checkValue, value || [])}
                name={checkValue}
                onChange={onChangeMultipleCheck}
                styleName="radio-control-bubble"
              />
              <Typography>{displayName}</Typography>
            </div>
          ))
        }
    </>
  );
}

CheckBox.defaultProps = {
  additionalInfo: {},
  value: '',
  source: '',
  disabled: false,
};

CheckBox.propTypes = {
  additionalInfo: PropTypes.shape({
    customType: PropTypes.string,
    hasTitle: PropTypes.bool,
    styleName: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  onChangeMultipleBox: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    isEnabled: PropTypes.bool,
    textColor: PropTypes.string,
    value: PropTypes.string.isRequired,
  })).isRequired,
  source: PropTypes.string,
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default CheckBox;
