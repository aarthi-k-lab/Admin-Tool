import React from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import './TaskSection.css';
import { withStyles } from '@material-ui/core/styles';
import { operations } from 'ducks/tasks-and-checklist';
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
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import DocumentList from '../DocumentList';
import DocumentViewer from '../DocumentViewer/DocumentViewer';

const tempData = {
  '4506-C': ['Section 6 incomplete, must list 1040',
    'Section 6A incomplete',
    'Section 8 missing current year or correct format',
    'Section 3 does not reflect correct mailing address filed with Tax Return',
    'Document is not legible',
    'Document is expired',
    'Missing Pages',
    'Document is altered/marked up',
    'Document is filled out incorrectly',
    'Document is not signed',
    'Document is not Dated',
    'Other-See Comments',
    'Need 4506-C not 4506-T or  4506-T EZ form',
    'Document not provided'],
  'Mortgage Assistance Application (MAA)': ['Section 6 incomplete, must list 1040',
    'Section 6A incomplete',
    'Section 8 missing current year or correct format',
    'Section 3 does not reflect correct mailing address filed with Tax Return',
    'Document is not legible',
    'Document is expired',
    'Missing Pages'],
};

// const mockData = ;


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

const AccordionHeaderSummary = withStyles({
  content: {
    display: 'block',
    width: '50%',
  },
})(MuiAccordionSummary);

const AccordianHeaderDetails = withStyles(() => ({
  root: {
    padding: 4,
    display: 'grid',
  },
}))(MuiAccordionDetails);
class TaskSection extends React.PureComponent {
  componentDidMount() {
    const { additionalInfo: { actions, customType, selector }, processAction, source } = this.props;
    if (customType === 'accordian') {
      const type = R.pathOr(null, ['preProcess'], actions);
      const payload = {
        source, selector,
      };
      if (type) processAction(type, payload);
    }
  }

  getCustomType = (children) => {
    const {
      value, additionalInfo: {
        styleName, customType, labels, tooltip, hasTitle, horizontalRule, heightMultiplier,
        columnSize, labelSize, actionIcon, columns, valuePath, hasLabelValue,
        iconPosition, id, labelValuePath, showErrorCount, labelValueAdornment,
        isAccordianTitle, defaultExpanded, cnsdtType, colSpan, columnHeaders, columnLabel, spacing,
      }, title, disabled, failureReason, onChange, accHeaderData,
    } = this.props;
    // const { mockData, radioSelect } = this.state;
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
        onClick={() => (!disabled && onChange(actionValue))}
        style={{ paddingRight: '3rem', cursor: disabled ? 'not-allowed' : 'pointer', paddingLeft: '0.5rem' }}
        styleName={getStyleName('taskSection', styleName, 'icon')}
      >
        {actionIcon}
      </Icon>
    );

    const renderErrorCount = () => (
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
    );

    const renderBorrowerDetails = () => (
      <div>
        <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }} variant="h6">
          {R.propOr('', 'name', accHeaderData)}
        </Typography>
        <Typography styleName="acc-sub-header-txt">
          {R.propOr('', 'description', accHeaderData)}
        </Typography>
      </div>
    );

    const item = (
      <>
        {(header || deleteIcon) && (
          <div
            style={R.propOr({}, iconPosition, direction)}
            styleName={getStyleName('taskSection', styleName, 'item')}
          >
            {showErrorCount && (
              renderErrorCount()
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
    switch (customType) {
      case 'cnsdt-header': {
        return (
          <>
            <Paper elevation={2} square style={{ ...minHeightStyle }} styleName={styleName || ''}>
              {(header) && (
                <div
                  style={{ display: 'flex' }}
                  styleName={getStyleName('taskSection', styleName, 'item')}
                >
                  <h3>{header}</h3>
                  <div style={{ marginLeft: '2rem', marginTop: '1.50rem' }}>
                    {showErrorCount && (
                      renderErrorCount()
                    )}
                  </div>
                </div>
              )}
              {hr}
              {children}
            </Paper>
          </>
        );
      }
      case 'paper': {
        return (
          <Paper elevation={2} square style={{ ...minHeightStyle }} styleName={styleName || ''}>
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
              spacing={spacing}
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
                      <p styleName={getStyleName('taskSection', R.equals(label, 'Net') ? styleName : 'default', 'grid-label')}>
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
        let labelData;
        if (isAccordianTitle) {
          labelData = (
            <div style={{ display: 'flex' }}>
              <h3>{labels}</h3>
              <div style={{ marginLeft: '2rem', marginTop: '4px' }}>
                {' '}
                {showErrorCount && (
                  renderErrorCount()
                )}
              </div>
            </div>
          );
        } else {
          labelData = labels && labels.map((label, index) => (
            <div>
              <p styleName={getStyleName('taskSection', styleName, 'label')}>
                {R.toLower(label)}
              </p>
              <p styleName={getStyleName('taskSection', styleName, 'labelValue')}>
                {R.propOr('', R.nth(index, labels), labelValue)}
              </p>
            </div>
          ));
        }
        return (
          <Accordion defaultExpanded={defaultExpanded}>
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
      case 'accordian-with-header': {
        const grossNetData = labels && labels.map(label => (
          <div styleName="gross-net-div">
            <Typography styleName="gn-sub-header-amt-txt">
              {label}
            </Typography>
            <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }} variant="h6">
              {`$ ${R.pathOr('0.00', ['labelValues', 'GrossNetIncome', label], value)}`}
            </Typography>
          </div>
        ));
        return (
          <Accordion>
            <AccordionHeaderSummary
              expandIcon={<ExpandMoreIcon />}
            >
              {(!cnsdtType || cnsdtType !== 'income') && (
                <div styleName="cnsdt-amt-sect-details">
                  {renderBorrowerDetails()}
                  <div>
                    <Typography styleName="acc-sub-header-amt-txt">
                      {R.propOr('', '0', labels)}
                    </Typography>
                    <Typography style={{ fontWeight: 'bold', fontSize: '1.1rem' }} variant="h6">
                      {`$ ${R.pathOr('0.00', ['labelValues', 'ExpenseAmt'], value)}`}
                    </Typography>
                  </div>
                </div>
              )}
              {(cnsdtType && cnsdtType === 'income') && (
                <div styleName="gross-net-section">{grossNetData}</div>
              )}
            </AccordionHeaderSummary>
            <AccordianHeaderDetails
              styleName={getStyleName('taskSection', styleName, 'details')}
            >
              {children}
            </AccordianHeaderDetails>
          </Accordion>
        );
      }
      case 'borrower-details':
        return (
          <div>
            {renderBorrowerDetails()}
            <Typography styleName="acc-sub-header-amt-txt">
              {R.propOr('', '0', labels)}
            </Typography>
          </div>
        );
      case 'data-headers':
        return (
          <Table size="small">
            <TableHead>
              <TableRow style={{ display: 'flex', justifyContent: 'space-between' }}>
                {columnHeaders && columnHeaders.map((headerName, index) => (
                  <TableCell
                    key={headerName}
                    align="center"
                    colSpan={colSpan[index]}
                    styleName={headerName ? getStyleName('taskSection', styleName, 'header')
                      : getStyleName('taskSection', styleName, 'space')}
                  >
                    {headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          </Table>
        );
      case 'data-row':
        return (
          <Table size="small">
            <TableBody>
              <TableRow
                key={columnLabel}
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <TableCell colSpan={6} styleName={getStyleName('taskSection', styleName, 'inctype')}>{columnLabel}</TableCell>
                <TableCell colSpan={6} styleName={getStyleName('taskSection', styleName, 'amount')}>
                  {`$ ${R.pathOr('0.00', ['totalGrossNet', 'GROSS'], value)}`}
                </TableCell>
                <TableCell colSpan={6} styleName={getStyleName('taskSection', styleName, 'amount')}>
                  {`$ ${R.pathOr('0.00', ['totalGrossNet', 'NET'], value)}`}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );
      case 'document-checklist': { return (<DocumentList tempData={tempData} />); }
      case 'document-viewer': { return <DocumentViewer />; }
      default: {
        return (
          <div
            id={id}
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
    isAccordianTitle: false,
    defaultExpanded: false,
    cnsdtType: null,
    columnHeaders: [],
    columnLabel: '',
    colSpan: [],
    spacing: 0,
  },
  value: {},
  disabled: false,
  source: '',
  failureReason: {},
};

TaskSection.propTypes = {
  accHeaderData: PropTypes.shape().isRequired,
  additionalInfo: PropTypes.shape({
    actionIcon: PropTypes.string,
    actions: PropTypes.string,
    cnsdtType: PropTypes.string,
    colSpan: PropTypes.arrayOf(),
    columnHeaders: PropTypes.arrayOf(),
    columnLabel: PropTypes.string,
    columns: PropTypes.number,
    columnSize: PropTypes.arrayOf(),
    content: PropTypes.string,
    customType: PropTypes.string,
    defaultExpanded: PropTypes.bool,
    disableDuplicate: PropTypes.arrayOf(),
    hasLabelValue: PropTypes.bool,
    hasTitle: PropTypes.bool,
    heightMultiplier: PropTypes.number,
    horizontalRule: PropTypes.bool,
    iconPosition: PropTypes.string,
    id: PropTypes.string,
    isAccordianTitle: PropTypes.bool,
    labels: PropTypes.arrayOf(),
    labelSize: PropTypes.arrayOf(),
    labelValueAdornment: PropTypes.arrayOf().isRequired,
    labelValuePath: PropTypes.arrayOf(),
    position: PropTypes.string,
    selector: PropTypes.string,
    showErrorCount: PropTypes.bool,
    spacing: PropTypes.number,
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
  processAction: PropTypes.func.isRequired,

  renderChildren: PropTypes.func.isRequired,
  source: PropTypes.string,
  subTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
  value: PropTypes.shape(),
};

const mapDispatchToProps = dispatch => ({
  processAction: operations.preProcessChecklistItems(dispatch),
});

export default connect(null, mapDispatchToProps)(TaskSection);
