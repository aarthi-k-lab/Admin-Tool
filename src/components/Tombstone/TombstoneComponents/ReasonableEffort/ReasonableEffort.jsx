import { Grid, IconButton, Typography } from '@material-ui/core/index';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useState } from 'react';
import * as moment from 'moment';
import * as R from 'ramda';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { operations as tombstoneOperations, selectors as tombstoneSelectors } from 'ducks/tombstone';
import PropTypes from 'prop-types';
import ReasonableEffortHistory from './ReasonableEffortHistory';
import './ReasonableEffort.css';

const REASONABLE_EFFECT_TABLE_COLUMNS = [
  {
    name: 'letterType',
    label: 'Letter Type',
    align: 'left',
    minWidthHead: 100,
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: 'letterSendDate',
    label: 'Letter Sent Date',
    align: 'left',
    minWidthHead: 100,
    options: {
      filter: true,
      sort: false,
    },
    cellFormat: value => moment(value).format('MM/DD/YYYY'),
  },
  {
    name: 'deadlineDate',
    label: 'Deadline Date',
    align: 'left',
    minWidthHead: 100,
    options: {
      filter: true,
      sort: false,
    },
    cellFormat: value => moment(value).format('MM/DD/YYYY'),
  },
  {
    name: 'exclReason',
    label: 'Excl Reason',
    align: 'left',
    minWidthHead: 100,
    options: {
      filter: true,
      sort: false,
    },
  },
];

function ReasonableEffort(props) {
  const { reasonableEffortData, tombstoneReaonableEffortId } = props;
  const [missingDocData, setMissingDocData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [data, setData] = useState([]);
  const [reasonableEffortId, setReasonableEffortId] = useState('');
  const [isHistoryId, setHistoryId] = useState(false);

  const handleClose = () => {
    const { setChecklistCenterPaneData } = props;
    setChecklistCenterPaneData('Checklist');
  };

  useEffect(() => {
    setMissingDocData(R.pathOr([], ['missDocData'], reasonableEffortData));
    setHistoryData(R.pathOr([], ['history'], reasonableEffortData));
    setData(R.pathOr([], ['data'], reasonableEffortData));
  }, [reasonableEffortData]);

  useEffect(() => {
    setHistoryId(!R.isNil(reasonableEffortId) && !R.isEmpty(reasonableEffortId)
    && !R.isNil(tombstoneReaonableEffortId) && !R.isEmpty(tombstoneReaonableEffortId)
    && tombstoneReaonableEffortId !== reasonableEffortId);
  }, [reasonableEffortId]);

  return (
    <Grid container>
      <Grid item xs={11}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography styleName="heading">
             Reasonable Effort
          </Typography>
          <IconButton>
            <ReasonableEffortHistory
              historyData={historyData}
              setReasonableEffortId={setReasonableEffortId}
            />
          </IconButton>
          {
            isHistoryId
              ? (
                <div style={{ display: 'flex', flexDirection: 'row', marginTop: '1rem' }}>
                  <Typography styleName="reasonable-effort-id-display">
                     Reasonable Effort Id :
                  </Typography>
                  <Typography styleName="reasonable-effort-name-display">
                    {reasonableEffortId}
                  </Typography>
                </div>
              ) : <></>
          }

        </div>
      </Grid>
      <Grid item styleName="closeButton" xs={1}>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Grid>
      <Grid />
      <Grid container direction="row" styleName="reasonableEffortCont">
        {
          data && data.map(({ content, title }) => (
            <div styleName="item">
              <span styleName="title">{title}</span>
              <span styleName="content">
                {
                  content === '' ? '-' : content
                }
              </span>
            </div>
          ))
        }
      </Grid>
      <Grid container direction="column" styleName="tableContainer">
        <Grid item styleName="titleContainer">
          <Typography styleName="missDocTitle">
            Missing Documents
          </Typography>
        </Grid>
        <Grid item>
          <TableContainer
            component={Paper}
            elevation={0}
            style={{ maxHeight: 450, backgroundColor: '#F3F5F9' }}
          >
            <Table style={{ width: 'max-content' }}>
              <TableHead>
                <TableRow>
                  {REASONABLE_EFFECT_TABLE_COLUMNS.map(
                    (item, i) => item && (
                    <TableCell
                      key={item.name ? item.name : i}
                      align={item.align}
                      styleName="tableCell"
                    >
                      {item.label}
                    </TableCell>
                    ),
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {missingDocData && missingDocData.map(row => (
                  <TableRow>
                    {Object.entries(row).map(([key, value]) => (
                      <TableCell align="left" id={`${key}_${value}`} styleName="tableCellValue">
                        {value || ''}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
}

ReasonableEffort.defaultProps = {
};

ReasonableEffort.propTypes = {
  reasonableEffortData: PropTypes.shape().isRequired,
  setChecklistCenterPaneData: PropTypes.func.isRequired,
  tombstoneReaonableEffortId: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  reasonableEffortData: tombstoneSelectors.getReasonableEffortData(state),
  tombstoneReaonableEffortId: tombstoneSelectors.getReasonableEffortId(state),
});

const mapDispatchToProps = dispatch => ({
  setChecklistCenterPaneData: tombstoneOperations.setChecklistCenterPaneDataOperation(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReasonableEffort);
