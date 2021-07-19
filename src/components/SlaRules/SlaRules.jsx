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
import {
  ERROR, SUCCESS, TRUE, FALSE,
} from 'constants/common';
import './SlaRules.css';

function getIcon(result) {
  let iconName = '';
  switch (result) {
    case TRUE:
      iconName = <CheckCircleOutlineIcon styleName="succesicon" />;
      break;
    case FALSE:
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

function getMiscResult(options) {
  return R.all(item => getResult(item), options) ? TRUE : FALSE;
}

const getMessage = (data) => {
  const text = R.propOr('', 'text', data);
  const result = getResult(data);
  return !R.isEmpty(text)
    ? (
      <div styleName="notificationMsg">
        <UserNotification
          key={text}
          level={result === FALSE ? ERROR : SUCCESS}
          message={parse(text)}
          type="alert-box"
        />
      </div>
    )
    : null;
};
class SlaRules extends React.Component {
  render() {
    const {
      title, options, value, additionalInfo: { displayName },
    } = this.props;
    const isList = R.is(Array, options) && !R.isEmpty(options);
    const result = isList ? getMiscResult(options) : getResult(options);
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
                {!isList && <FormLabel component="legend" styleName="margin">{displayName}</FormLabel>}
                {isList ? R.map(message => getMessage(message), options) : getMessage(options)}
              </span>
              <span>
                {result === FALSE && (
                <TextField
                  label="Enter your comment here*"
                  margin="dense"
                  multiline
                  placeholder="Comment"
                  rows="4"
                  rowsMax="6"
                  styleName="multiline"
                  value={value}
                  variant="outlined"
                  {...this.props}
                />
                ) }
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

SlaRules.defaultProps = {
  value: null,
};

SlaRules.propTypes = {
  additionalInfo: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  options: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape()), PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    isEnabled: PropTypes.bool,
    textColor: PropTypes.string,
    value: PropTypes.string.isRequired,
  })]).isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default SlaRules;
