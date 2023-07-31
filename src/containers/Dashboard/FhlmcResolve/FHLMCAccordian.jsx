import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EventNoteIcon from '@material-ui/icons/EventNote';
import GetAppIcon from '@material-ui/icons/GetApp';
import PersonIcon from '@material-ui/icons/Person';
import { PropTypes } from 'prop-types';
import './FhlmcResolve.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import ResultStatus from 'components/ResultStatus';


const FHLMCAccordian = ({ loanData = [], selectedRequestType }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div styleName="history-container">
      {loanData.map(loanItem => (
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary
            aria-controls="panel1bh-content"
            expandIcon={<ExpandMoreIcon />}
            id="panel1bh-header"
            styleName="accordian-header-container"
          >
            <div styleName="flex">
              <Typography styleName="accordian-header">{selectedRequestType}</Typography>
              <Typography styleName="flex accordian-header-subtext">
                {' '}
                <PersonIcon />
                {' '}
                William Charles
              </Typography>
              <Typography styleName="flex accordian-header-subtext">
                {' '}
                <EventNoteIcon />
                {' '}
                <p style={{ paddingLeft: 8, margin: 0 }}>
                  {loanItem.borrowerResponsePackageReceivedDate}
                </p>
              </Typography>
            </div>
            <div styleName="flex absolute">
              <GetAppIcon style={{ color: '#4E586E' }} />
              <Typography style={{ background: loanItem.isValid ? '#00AB84' : '#E20E34' }} styleName="status-text">{loanItem.isValid ? 'Passed' : 'Failed'}</Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell styleName="table-header"> Case ID</TableCell>
                    <TableCell styleName="table-header">Eval ID</TableCell>
                    <TableCell styleName="table-header">Loan Number</TableCell>
                    <TableCell styleName="table-header">Resolution ID</TableCell>
                    {loanItem.message ? (
                      <TableCell styleName="table-header">
                        Message
                      </TableCell>
                    ) : null}
                    <TableCell styleName="table-header">Modification History</TableCell>
                    <TableCell styleName="table-header">ODM Ineligible Response</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={loanItem.resolutionId}>
                    <TableCell styleName="table-body">
                      {loanItem.resolutionId}
                    </TableCell>
                    <TableCell styleName="table-body">{loanItem.evalId}</TableCell>
                    <TableCell styleName="table-body">{loanItem.servicerLoanIdentifier || loanItem.loanNumber}</TableCell>
                    <TableCell styleName="table-body">{loanItem.resolutionId}</TableCell>
                    {loanItem.message ? (
                      <TableCell styleName="table-content-align table-body">
                        {loanItem.message}
                      </TableCell>
                    ) : null}
                    {selectedRequestType ? (
                      <TableCell styleName="table-body">
                        {selectedRequestType}
                      </TableCell>
                    ) : (
                      <TableCell />
                    )}
                    <TableCell styleName="align-selector table-body">
                      <ResultStatus cellProps={{ original: { isValid: loanItem.isValid } }} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

FHLMCAccordian.propTypes = {
  loanData: PropTypes.arrayOf({
    resolutionId: PropTypes.string,
    message: PropTypes.string,
    evalId: PropTypes.string,
    servicerLoanIdentifier: PropTypes.string,
    loanNumber: PropTypes.string,
    isValid: PropTypes.string,
  }).isRequired,
  selectedRequestType: PropTypes.string.isRequired,
};

export default FHLMCAccordian;
