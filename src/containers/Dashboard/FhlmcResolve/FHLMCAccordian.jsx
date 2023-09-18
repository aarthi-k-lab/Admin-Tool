import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EventNoteIcon from '@material-ui/icons/EventNote';
// import GetAppIcon from '@material-ui/icons/GetApp';
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
import * as R from 'ramda';
import Button from '@material-ui/core/Button';
import ExpandableCell from '../../../components/NavExpMUITable/ExpandableCell/ExpandableCell';


const accordiansPerPage = 5;


const FHLMCAccordian = ({
  loanData = [], popupTableData = [],
  // downloadFile,
}) => {
  const totalPages = Math.ceil(popupTableData.length / accordiansPerPage);
  const [expanded, setExpanded] = React.useState([]);
  // const [downloaded, setDownloaded] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * accordiansPerPage;
  const endIndex = startIndex + accordiansPerPage;
  const currentPageData = popupTableData.slice(startIndex, endIndex);


  const handleChange = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
    // setDownloaded(false);
  };

  // const handleDownload = historyData => () => {
  //   if (!downloaded) {
  //     const payload = {};
  //     payload.fileName = 'REQUEST_HISTORY.xlsx';
  //     payload.data = historyData;
  //     downloadFile(payload);
  //     setDownloaded(true);
  //   }
  // };

  const renderPagination = () => {
    const maxPage = Math.min(totalPages, 10);
    let startPage = Math.max(1, currentPage - Math.floor(maxPage / 2));
    const endPage = Math.min(totalPages, startPage + maxPage - 1);

    if (endPage - startPage + 1 < maxPage) {
      startPage = Math.max(1, endPage - maxPage + 1);
    }

    const paginationButtons = Array.from({ length: endPage - startPage + 1 }, (_, index) => (
      <Button
        key={index + 1}
        disabled={currentPage === startPage + index}
        onClick={() => handlePageChange(index + startPage)}
        styleName="pagination-buttons"
      >
        {startPage + index}
      </Button>
    ));

    return (
      <div styleName="pagination">
        <Button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </Button>
        {paginationButtons}
        {currentPage < totalPages && (
        <Button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
                  Next
        </Button>
        )}

      </div>
    );
  };

  const renderHistory = (historyData, index) => (
    (
      <div styleName="history-container">
        <Accordion
          key={index}
          expanded={expanded[index] || false}
          onChange={() => handleChange(index)}
        >
          <AccordionSummary
            aria-controls="panel1bh-content"
            expandIcon={<ExpandMoreIcon />}
            id="panel1bh-header"
            styleName="accordian-header-container"
          >
            <div styleName="flex">
              <Typography styleName="accordian-header">{historyData.reqTypeText}</Typography>
              <Typography styleName="flex accordian-header-subtext">
                {' '}
                <PersonIcon />
                {' '}
                {historyData && historyData.initiatedBy}
              </Typography>
              <Typography styleName="flex accordian-header-subtext">
                {' '}
                <EventNoteIcon />
                {' '}
                <p style={{ paddingLeft: 8, margin: 0 }}>
                  {historyData && historyData.requestDateTime}
                </p>
              </Typography>
            </div>
            <div styleName="flex absolute">
              {/* <Button onClick={handleDownload(historyData)}>
              <GetAppIcon style={{ color: '#4E586E', cursor: 'pointer' }} /></Button> */}
              <Typography style={{ backgroundColor: `${R.contains('SUCCESS', historyData.requestStatus) ? '#45C768' : '#e53935'}` }} styleName="status-text">
                {historyData && historyData.requestStatus}
              </Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell styleName="table-header"> Case ID</TableCell>
                    <TableCell styleName="table-header">Eval ID</TableCell>
                    <TableCell style={{ width: '35rem' }} styleName="table-header">
                      Message
                    </TableCell>
                    <TableCell styleName="table-header">Modification History</TableCell>
                    <TableCell styleName="table-header">ODM Ineligible Response</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={historyData.caseId}>
                    <TableCell styleName="table-body">
                      {historyData.caseId}
                    </TableCell>
                    <TableCell styleName="table-body">{!R.isEmpty(loanData) && loanData[0].evalId}</TableCell>
                    <TableCell styleName="table-content-align table-body message-field">
                      {historyData.requestStatusMessage
                      && !R.isEmpty(historyData.requestStatusMessage)
                      && historyData.requestStatusMessage.length > 50
                        ? (
                          <ExpandableCell
                            data={historyData.requestStatusMessage}
                            width="400"
                          />
                        ) : historyData.requestStatusMessage

                      }

                    </TableCell>
                    <TableCell styleName="table-body">
                      {historyData.modHistory}
                    </TableCell>
                    <TableCell styleName="align-selector table-body">
                      {historyData.odmInEligibleMessage ? historyData.odmInEligibleMessage : 'NA'}
                    </TableCell>
                  </TableRow>
                </TableBody>

              </Table>
            </TableContainer>

          </AccordionDetails>
        </Accordion>
      </div>
    )
  );

  // eslint-disable-next-line max-len
  const renderPaginatedContent = () => currentPageData.map((historyitem, index) => renderHistory(historyitem, index));


  return (
    <div>
      {renderPaginatedContent()}
      {renderPagination()}
    </div>
  );
};

FHLMCAccordian.propTypes = {
  // downloadFile: PropTypes.func.isRequired,
  loanData: PropTypes.arrayOf({
    resolutionId: PropTypes.string,
    message: PropTypes.string,
    evalId: PropTypes.string,
    servicerLoanIdentifier: PropTypes.string,
    loanNumber: PropTypes.string,
    isValid: PropTypes.string,
  }).isRequired,
  popupTableData: PropTypes.arrayOf({
    resolutionId: PropTypes.string,
    message: PropTypes.string,
    evalId: PropTypes.string,
    servicerLoanIdentifier: PropTypes.string,
    loanNumber: PropTypes.string,
    isValid: PropTypes.string,
  }).isRequired,
  // showMessage: ?PropTypes.bool.isRequired,
};


export default FHLMCAccordian;
