import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import FormLabel from '@material-ui/core/FormLabel';
import Cancel from '@material-ui/icons/Cancel';
import UserNotification from 'components/UserNotification/UserNotification';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import parse from 'html-react-parser';
import './SlaRules.css';

function getIcon(result) {
  let iconName = '';
  switch (result) {
    case 'true':
      iconName = <CheckCircleOutlineIcon styleName="succesicon" />;
      break;
    case 'false':
      iconName = <Cancel styleName="failedicon" />;
      break;
    default:
      iconName = <CheckCircleOutlineIcon />;
  }
  return iconName;
}

function getResult(value) {
  return R.head(R.values(R.pickBy((val, key) => R.contains('Check', key), value)));
}


class SlaRules extends React.Component {
  render() {
    const {
      title, options, value, additionalInfo: { displayName },
    } = this.props;
    const result = getResult(options);
    const text = R.propOr('', 'text', options);
    const component = (
      <>
        <div styleName="custommargin">
          <Grid styleName="container">
            <Grid styleName="right">
              {getIcon(result)}
            </Grid>
            <Grid>
              <span>
                <b>{title}</b>
              </span>
              <span>
                <FormLabel component="legend" styleName="margin">{displayName}</FormLabel>
                {!R.isEmpty(text)
                  ? (
                    <div styleName="notificationMsg">
                      <UserNotification
                        level={result === 'false' ? 'error' : 'success'}
                        message={parse(text)}
                        type="alert-box"
                      />
                    </div>
                  )
                  : null}
              </span>
              <span>
                {result === 'false'
                  ? (
                    <TextField
                      id="standard-multiline-flexible"
                      label="Enter your comment here*"
                      margin="dense"
                      multiline
                      rows="4"
                      rowsMax="6"
                      styleName="multiline"
                      value={value}
                      variant="outlined"
                      {...this.props}
                    />
                  ) : null
                }
              </span>
            </Grid>

          </Grid>
        </div>
        <Divider />
      </>

    );

    return component;
  }
}

SlaRules.propTypes = {
  additionalInfo: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    isEnabled: PropTypes.bool,
    textColor: PropTypes.string,
    value: PropTypes.string.isRequired,
  })).isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.shape.isRequired,
};

export default SlaRules;
