import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './CustomButton.css';
import Icon from '@material-ui/core/Icon';
import * as R from 'ramda';
import IncomeCalcHistory from './IncomeCalcHistory';

class CustomButton extends React.PureComponent {
  getButtonByType = () => {
    const {
      title,
      onChange,
      additionalInfo,
      source,
      value,
      disabled,
    } = this.props;
    const {
      customType, size, icon, styleName,
    } = additionalInfo;
    const buttonTitle = R.equals(source, 'value') ? value : title;
    const cursor = { marginLeft: '1rem', alignItems: 'center', fontSize: '1rem' };
    const { position } = additionalInfo;
    switch (customType) {
      case 'iconWithLabel': {
        const button = (
          <Icon disabled={disabled} style={cursor}>
            {icon}
          </Icon>
        );
        const iconWithLabel = R.equals(position, 'start')
          ? (
            <div styleName={styleName}>
              {buttonTitle}
              {button}
            </div>
          )
          : (
            <>
              {button}
              {buttonTitle}
            </>
          );
        return iconWithLabel;
      }
      case 'text-icon-divider': {
        const { endIcon } = additionalInfo;
        const style = {
          button: {
            padding: '0rem 0.3rem 0rem 0.75rem',
            cursor: 'pointer',
            backgroundColor: '#01579b',
            color: 'white',
            borderRadius: '2px',
            display: 'flex',
            margin: 'auto',
          },
          div: { display: 'flex' },
          hr: { height: '2rem', margin: '0rem' },
          icon: { marginTop: '0.25rem' },
        };
        return (
          <Button
            disabled={disabled}
            endIcon={(
              <div style={style.div}>
                <hr style={style.hr} />
                <Icon style={{ margin: '0.3rem' }}>
                  {endIcon}
                </Icon>
              </div>
            )}
            onClick={() => onChange(true)}
            style={style.button}
          >
            {buttonTitle}
          </Button>
        );
      }
      case 'link': {
        return (
          <Button color="primary" disabled={disabled}>
            {buttonTitle}
          </Button>
        );
      }
      case 'textWithIcon': {
        const { startIcon, endIcon } = additionalInfo;
        const props = {
          endIcon: endIcon && <Icon styleName="iconGrey">{endIcon}</Icon>,
          startIcon: startIcon && <Icon styleName="iconGrey">{startIcon}</Icon>,
          styleName,
        };
        return (
          <Button
            disabled={disabled}
            onClick={() => onChange(true)}
            styleName={styleName}
            {...props}
          >
            {buttonTitle}
          </Button>
        );
      }
      case 'icon': {
        return (
          <Icon
            onClick={() => !disabled && onChange(true)}
            size={size}
            style={disabled ? { color: 'grey' } : {
              cursor: 'pointer',
            }}
            styleName={styleName || 'default'}
          >
            {icon}
          </Icon>
        );
      }
      case 'image': {
        const { image } = additionalInfo;
        return (
          <div disabled={disabled} styleName={styleName || ''}>
            {R.equals(position, 'start')
              ? (
                <>
                  <img alt="content" src={`/static/img/${image}`} style={{ width: '80px' }} />
                  <p>
                    {buttonTitle}
                  </p>
                </>
              )
              : (
                <>
                  <p>
                    {buttonTitle}
                  </p>
                  <img alt="content" src={`/static/img/${image}`} />
                </>
              )
            }
          </div>
        );
      }
      case 'incomecalc-history': {
        return <IncomeCalcHistory disabled={disabled} itemList={value} />;
      }
      default: {
        return (
          <Button
            disabled={disabled}
            onClick={() => onChange(true)}
            styleName={styleName || ''}
          >
            {buttonTitle}
          </Button>
        );
      }
    }
  };

  render() {
    const button = this.getButtonByType();
    return button;
  }
}


CustomButton.defaultProps = {
  additionalInfo: {},
  disabled: false,

};

CustomButton.propTypes = {
  additionalInfo: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  source: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default CustomButton;
