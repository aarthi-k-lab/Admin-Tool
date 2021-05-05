import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import './TaskSection.css';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { direction, getStyleName } from 'constants/incomeCalc/styleName';

const AccordionSummary = withStyles({
  root: {
    minHeight: '1.5rem',
    '&$expanded': {
      minHeight: '1.5rem',
    },
  },
})(MuiAccordionSummary);


const AccordionDetails = withStyles(() => ({
  root: {
    padding: 0,
  },
}))(MuiAccordionDetails);

class TaskSection extends React.PureComponent {
  getCustomType= (children) => {
    const {
      value, onChange, additionalInfo: {
        styleName, customType, labels, tooltip, hasTitle, horizontalRule, heightMultiplier,
        columnSize, labelSize, actionIcon, columns, valuePath, hasLabelValue,
        iconPosition, id, labelValuePath, showErrorCount, labelValueAdornment,
      }, title, disabled, failureReason,
    } = this.props;
    const actionValue = valuePath ? R.assocPath(valuePath, true, {}) : true;
    const headerStyle = getStyleName('taskSection', styleName, 'header');
    const hr = horizontalRule && (
    <hr style={{
      height: '1px', backgroundColor: '#9e9e9e', borderWidth: 0, margin: '0.5rem 0rem 1rem 0rem',
    }}
    />
    );
    const header = (hasTitle) && (
      <Typography styleName={headerStyle}>
        {title}
      </Typography>
    );
    const deleteIcon = actionIcon && (
      <Icon
        disabled={disabled}
        onClick={() => onChange(actionValue)}
        style={{ paddingRight: '3rem', cursor: 'pointer', paddingLeft: '0.5rem' }}
        styleName={getStyleName('taskSection', styleName, 'icon')}
      >
        {actionIcon}
      </Icon>
    );


    const item = (
      <>
        {(header || deleteIcon) && (
          <div
            style={R.propOr({}, iconPosition, direction)}
            styleName={getStyleName('taskSection', styleName, 'item')}
          >
            { showErrorCount && (
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p>Errors</p>
                <span styleName="box">
                  {R.propOr(0, 1, failureReason)}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
                <p>Warnings</p>
                <span styleName="box1">{R.propOr(0, 2, failureReason)}</span>
              </div>
            </div>
            )
            }
            {deleteIcon}
            {header}
          </div>
        )}
        {hr}
        {children}
      </>
    );
    const height = children && (children.length * heightMultiplier);
    const minHeightStyle = heightMultiplier && {
      minHeight: `${height}rem`,
      paddingBottom: '2rem',
      marginBottorm: '2rem',
    };
    const disabledStyle = disabled && {
      backgroundColor: '#eee',
    };
    switch (customType) {
      case 'paper': {
        return (
          <Paper elevation={2} square style={{ ...minHeightStyle, ...disabledStyle }} styleName={styleName || ''}>
            {item}
          </Paper>
        );
      }
      case 'grid': {
        const remainder = columnSize && (12 - columnSize.reduce((a, b) => a + b, 0));
        const labelRemainer = labelSize && (12 - labelSize.reduce((a, b) => a + b, 0));
        return (

          <>
            {header}
            <Grid
              container
              direction="row"
              style={{ ...disabledStyle }}
              styleName={getStyleName('taskSection', styleName, 'grid')}
            >
              {
                labels && labels.map((label, index) => (
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    xs={columnSize[index]}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p style={{ margin: '0.5rem 0', textTransform: 'capitalize' }}>{label}</p>
                      {tooltip && Array.isArray(tooltip) && !R.isEmpty(R.nth(index, tooltip)) && (
                      <Tooltip style={{ marginLeft: '0.5rem' }} title={R.nth(index, tooltip)}>
                        <Icon>info_outline</Icon>
                      </Tooltip>
                      )}
                    </div>
                    {!R.equals(hasLabelValue, false) && (
                    <p style={{ margin: '0', paddingRight: '2rem' }}>
                      {value && `${labelValueAdornment ? R.nth(index, labelValueAdornment) : ''} ${R.propOr('', R.nth(index, labels), value)}`}
                    </p>
                    )}
                  </Grid>
                ))
              }
              {labelRemainer !== 0 && <Grid item xs={labelRemainer} />}
              {children && children.map((rowItem, index) => (
                <>
                  <Grid
                    item
                    style={{ paddingBottom: '0.5rem' }}
                    styleName={getStyleName('taskSection', styleName, 'gridItem')}
                    xs={columnSize[index - (Math.floor(index / columns) * columns)]}
                  >
                    {rowItem}
                  </Grid>
                  {((index + 1) % columns) === 0 && <Grid item xs={remainder} />}
                </>
              ))}
            </Grid>
          </>
        );
      }
      case 'accordian': {
        const labelValue = R.pathOr({}, labelValuePath || [], value);
        const labelData = labels && labels.map((label, index) => (
          <div>
            <p styleName={getStyleName('taskSection', styleName, 'label')}>
              {R.toLower(label)}
            </p>
            <p styleName={getStyleName('taskSection', styleName, 'labelValue')}>
              {R.toLower(R.propOr('', R.nth(index, labels), labelValue))}
            </p>
          </div>
        ));
        return (
          <Accordion styleName={styleName}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <div styleName={getStyleName('taskSection', styleName, 'summary')}>{labelData}</div>
            </AccordionSummary>
            <AccordionDetails
              styleName={getStyleName('taskSection', styleName, 'details')}
            >
              {children}
            </AccordionDetails>
          </Accordion>
        );
      }
      default: {
        return (
          <div
            id={id}
            style={{ ...disabledStyle }}
            styleName={styleName || ''}
          >
            {item}
          </div>
        );
      }
    }
  }

  render() {
    const {
      renderChildren, subTasks,
    } = this.props;
    const children = renderChildren(subTasks);
    const taskSection = this.getCustomType(children);
    return (
      <div>
        {taskSection}
      </div>
    );
  }
}

TaskSection.defaultProps = {
  title: '',
  additionalInfo: {
    styleName: 'taskSection',
    hasTitle: true,
    customType: '',
    columns: 1,
    labels: {},
    tooltip: {},
    heightMultiplier: 15,
    columnSize: [],
    labelSize: [],
    labelValueAdornment: [],
    actionIcon: '',
    taskOptions: [],
    position: 'start',
    content: '',
    iconPosition: 'right',
    id: '',
    labelValuePath: [],
    showErrorCount: false,
    hasLabelValue: true,
  },
  value: {},
  disabled: false,
  failureReason: {},
};

TaskSection.propTypes = {
  additionalInfo: PropTypes.shape({
    actionIcon: PropTypes.string,
    columns: PropTypes.number,
    columnSize: PropTypes.arrayOf(),
    content: PropTypes.string,
    customType: PropTypes.string,
    disableDuplicate: PropTypes.arrayOf(),
    hasLabelValue: PropTypes.bool,
    hasTitle: PropTypes.bool,
    heightMultiplier: PropTypes.number,
    horizontalRule: PropTypes.bool,
    iconPosition: PropTypes.string,
    id: PropTypes.string,
    labels: PropTypes.arrayOf(),
    labelSize: PropTypes.arrayOf(),
    labelValueAdornment: PropTypes.arrayOf().isRequired,
    labelValuePath: PropTypes.arrayOf(),
    position: PropTypes.string,
    showErrorCount: PropTypes.bool,
    styleName: PropTypes.string,
    taskOptions: PropTypes.arrayOf(),
    tooltip: PropTypes.arrayOf(),
    valuePath: PropTypes.arrayOf(),
  }),
  disabled: PropTypes.bool,
  failureReason: PropTypes.shape({
    1: PropTypes.number,
    2: PropTypes.number,
  }),
  onChange: PropTypes.func.isRequired,
  renderChildren: PropTypes.func.isRequired,
  subTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
  value: PropTypes.shape(),
};

export default TaskSection;
