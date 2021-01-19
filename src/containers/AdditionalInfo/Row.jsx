
import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import * as R from 'ramda';
import './Row.css';

const formatDate = date => (date ? R.replace('T', ' ', date) : '-');

const Row = (props) => {
  const { data, onClick, changeColor } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow className="root" onClick={onClick} styleName={changeColor ? 'setBackground' : ''}>
        <TableCell align="center" colSpan={1} component="th" scope="row">
          {data.evalId === 0 ? '-' : data.evalId}
        </TableCell>
        <TableCell align="center">{data.resolutionId}</TableCell>
        <TableCell align="center">{R.propOr('-', 'status', data)}</TableCell>
        <TableCell align="center" colSpan={2}>{data.statusDate}</TableCell>
        <TableCell align="center" colSpan={1}>{R.propOr('-', 'substatus', data)}</TableCell>
        <TableCell align="center" colSpan={2}>{data.substatusDate}</TableCell>
        {!R.isNil(data.evalHistory) && !R.isEmpty(data.evalHistory)
          ? (
            <TableCell
              align="center"
              onClick={() => setOpen(!open)}
              style={{ color: 'lightseagreen', whiteSpace: 'nowrap' }}
            >
              {open ? 'Hide History' : 'Show History '}
            </TableCell>
          )
          : <TableCell />}
      </TableRow>
      {open && (
      <TableRow>
        <TableCell colSpan={9} styleName="historyTable">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table aria-label="purchases" size="small">
                <TableHead style={{ background: '#8080802b' }}>
                  <TableRow>
                    <HistoryHeader label="CHANGE TYPE" />
                    <HistoryHeader label="APPROVAL TYPE" />
                    <HistoryHeader label="UPDATED DATE" />
                    <HistoryHeader label="USER NAME" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.evalHistory.map(historyRow => (
                    <TableRow key={historyRow.EvalId}>
                      <HistoryRow content={historyRow.ChangeType} />
                      <HistoryRow content={historyRow.ApprovalType} />
                      <HistoryRow content={formatDate(historyRow.UpdateDate)} />
                      <HistoryRow content={historyRow.UserName} />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      )}
    </React.Fragment>
  );
};

const HistoryHeader = (props) => {
  const { label } = props;
  return (<TableCell align="center" style={{ color: 'grey' }}>{label}</TableCell>);
};

HistoryHeader.propTypes = {
  label: PropTypes.string.isRequired,
};

const HistoryRow = (props) => {
  const { content } = props;
  return (<TableCell align="center" styleName="rowStyle">{content}</TableCell>);
};

HistoryRow.propTypes = {
  content: PropTypes.string.isRequired,
};


Row.propTypes = {
  changeColor: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    evalHistory: PropTypes.arrayOf(
      PropTypes.shape({
        ApprovalType: PropTypes.string.isRequired,
        ChangeType: PropTypes.string.isRequired,
        UpdateDate: PropTypes.string.isRequired,
        UserName: PropTypes.string.isRequired,
      }),
    ).isRequired,
    evalId: PropTypes.string.isRequired,
    resolutionId: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    statusDate: PropTypes.string.isRequired,
    substatus: PropTypes.string.isRequired,
    substatusDate: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Row;
