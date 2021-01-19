import React from 'react';
import PropTypes from 'prop-types';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import ChatIcon from '@material-ui/icons/Chat';
import Grid from '@material-ui/core/Grid';
import * as R from 'ramda';
import './Cards.css';

const formatDate = date => (date ? R.replace('T', ' ', date) : '-');


const getCardSearchDetails = cardDetails => (
  cardDetails && cardDetails.map(data => (
    <Grid container direction="column" styleName="search-container">
      <Grid container direction="row">
        <Grid item styleName="tableData" xs={2}>
          <span>{data.ApprovalType}</span>
        </Grid>
        <Grid item styleName="tableData" xs={2}>
          <span>{formatDate(data.ActionDate)}</span>
        </Grid>
        <Grid item styleName="tableData" xs={2}>
          <span>{R.propOr('N/A', 'UserName', data)}</span>
        </Grid>
        <Grid item styleName="tableData" xs={2}>
          <span>{data.ChangeType}</span>
        </Grid>
        <Grid item styleName="tableData" xs={2}>
          <span>{R.propOr('N/A', 'Comment', data)}</span>
        </Grid>
        <Grid item styleName="tableData" xs={2}>
          <span>{R.propOr('N/A', 'SourceName', data)}</span>
        </Grid>
      </Grid>
    </Grid>
  ))
);

const Cards = (props) => {
  const { card, history, resolutionId } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <Grid
        alignItems="center"
        container
        justify="center"
      >
        <Grid xs={10}>
          <div styleName="cards">
            <div>
              <Grid container styleName="main-container">
                <Grid item styleName="user-detail" xs={3}>
                  <span styleName="value-style">{resolutionId}</span>
                  <br />
                  <span styleName="resolutionChoiceType">{card.ResolutionChoiceType}</span>
                </Grid>
                <Grid item styleName="right-item" xs={7}>
                  <Grid alignItems="center" container direction="row-reverse" justify="flex-start" spacing={2}>
                    <Grid item styleName="dateStyle">
                      <span styleName="value-style">StatusDate</span>
                      <br />
                      <span styleName="header-style">{formatDate(card.StatusDate)}</span>
                    </Grid>
                    <Grid item styleName="dateStyle">
                      <span styleName="value-style">LockedDate</span>
                      <br />
                      <span styleName="header-style">{formatDate(card.LockedDate)}</span>
                    </Grid>
                    <Grid item styleName="dateStyle">
                      <span styleName="value-style">CaseDate</span>
                      <br />
                      <span styleName="header-style">{formatDate(card.CaseOpenDate)}</span>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item styleName="user-detail" xs={2}>
                  <div styleName={R.contains(R.propOr('N/A', 'Status', card), ['Rejected', 'Failed']) ? 'failedStatus' : 'successStatus'}>{R.propOr('N/A', 'Status', card)}</div>
                  <div>
                    <span>
                      <SubdirectoryArrowRightIcon styleName="substatus" />
                    </span>
                    <span>
                      {R.propOr('N/A', 'SubStatus', card)}
                    </span>
                  </div>
                </Grid>
              </Grid>
              <Grid container direction="column" spacing={1} styleName="sub-container">
                <Grid item styleName="user-detail">
                  <span styleName="value-style">{R.propOr('N/A', 'UserName', R.head(R.propOr([], 'Values', R.head(history))))}</span>
                </Grid>
                <Grid item styleName="user-detail">
                  <Grid item xs={12}>
                    <Grid container justify="left">
                      <Grid item styleName="header-style">
                        <ChatIcon styleName="comments" />
                      </Grid>
                      <Grid item styleName="value-style">
                        {R.propOr('N/A', 'Comment', R.head(R.propOr([], 'Values', R.head(history))))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                {!R.isEmpty(R.head(history).Values)
                  ? (
                    <Grid item onClick={() => setOpen(!open)} styleName="user-detail">
                      <span styleName="history-style">{open ? 'Hide History' : 'Show History '}</span>
                    </Grid>
                  ) : null}
              </Grid>
              {
                open
                && (
                  <Grid container direction="row" styleName="search-container dateStyle">
                    <Grid item styleName="tableData" xs={2}>
                      <span>APPROVAL TYPE</span>
                    </Grid>
                    <Grid item styleName="tableData" xs={2}>
                      <span>ACTION DATE</span>
                    </Grid>
                    <Grid item styleName="tableData" xs={2}>
                      <span>USER NAME</span>
                    </Grid>
                    <Grid item styleName="tableData" xs={2}>
                      <span>CHANGE TYPE</span>
                    </Grid>
                    <Grid item styleName="tableData" xs={2}>
                      <span>COMMENTS</span>
                    </Grid>
                    <Grid item styleName="tableData" xs={2}>
                      <span>SOURCE</span>
                    </Grid>
                  </Grid>
                )
              }
              {open ? getCardSearchDetails(R.head(history).Values) : null}
            </div>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Cards.propTypes = {
  card: PropTypes.arrayOf(PropTypes.shape({
    cardDetails: PropTypes.arrayOf(PropTypes.shape({
      LoanId: PropTypes.string,
      UserName: PropTypes.string,
    })).isRequired,
    cardHistoryDetails: PropTypes.arrayOf(PropTypes.shape({
      LoanId: PropTypes.string,
      UserName: PropTypes.string,
    })).isRequired,
    evalHistory: PropTypes.arrayOf(PropTypes.shape({
      evalId: PropTypes.string,
      history: PropTypes.arrayOf(PropTypes.shape({
        evalId: PropTypes.string,
        loanNumber: PropTypes.string.isRequired,
      })).isRequired,
      loanNumber: PropTypes.string.isRequired,
    })).isRequired,
    evalId: PropTypes.string,
    loanId: PropTypes.string,
    resolutionId: PropTypes.string,
  })).isRequired,
  history: PropTypes.arrayOf(PropTypes.shape({
    evalId: PropTypes.string,
    loanNumber: PropTypes.string.isRequired,
    Values: PropTypes.arrayOf(PropTypes.shape({
      evalId: PropTypes.string,
      loanNumber: PropTypes.string.isRequired,
    })).isRequired,
  })).isRequired,
  resolutionId: PropTypes.string.isRequired,
};

export default Cards;
