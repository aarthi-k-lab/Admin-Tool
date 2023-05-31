import React, { useEffect } from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Grid, Typography, Checkbox } from '@material-ui/core';
import { selectors as documentChecklistSelectors, operations as documentChecklistOperations } from 'ducks/document-checklist';
import { DECEASED_BORROWER } from '../../../constants/incomeCalc/DocumentList';
import './BorrowerList.css';

function BorrowerList(props) {
  const {
    type, borrowerNames, selectedBorrower, checkedBorrowers,
    checkBorrowers, removalDocumentId, fetchBorrowersNames,
    removalDocumentName,
  } = props;
  useEffect(() => {
    let payload = {};
    if (type === 'link') {
      payload = {
        type: 'link',
      };
    }
    if (type === 'unlink') {
      payload = {
        type: 'unlink',
        removalDocumentId,
        removalDocumentName,
      };
    }
    fetchBorrowersNames(payload);
  }, []);
  return (
    <>
      {
      Object.keys(borrowerNames).length > 1
      && (
      <Grid item>
        <Typography
          styleName="otherBorrowersTitle"
        >
          Also apply to other borrower(s)
        </Typography>
      </Grid>
      )
      }
      {
        borrowerNames && Object.keys(borrowerNames).filter(
          name => name !== selectedBorrower,
        ).map(name => (
          <Grid container styleName="borrowerContainer">
            <Grid item styleName="borrowerCheckBoxContainer" xs={1}>
              <Checkbox
                checked={checkedBorrowers.includes(name)}
                disabled={name.includes(DECEASED_BORROWER)}
                onClick={() => checkBorrowers(name)}
                size="small"
                styleName={checkedBorrowers.includes(name) ? 'borrowerCheckBoxChecked' : 'borrowerCheckBoxUnchecked'}
              />
            </Grid>
            <Grid item styleName="borrowerDetailConatiner" xs={10}>
              <Typography styleName={`borrowerName ${name.includes(DECEASED_BORROWER) ? 'user-disable' : ''}`}>
                {R.pathOr('', [name, 'displayName'], borrowerNames)}
              </Typography>
              <Typography styleName={`borrowerOrder ${name.includes(DECEASED_BORROWER) ? 'user-disable' : ''}`}>
                {R.pathOr('', [name, 'description'], borrowerNames)}
              </Typography>
            </Grid>
          </Grid>
        ))
      }
    </>
  );
}

BorrowerList.defaultProps = {
  borrowerNames: [],
};

BorrowerList.propTypes = {
  borrowerNames: PropTypes.arrayOf(PropTypes.string),
  checkBorrowers: PropTypes.func.isRequired,
  checkedBorrowers: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchBorrowersNames: PropTypes.func.isRequired,
  removalDocumentId: PropTypes.number.isRequired,
  removalDocumentName: PropTypes.string.isRequired,
  selectedBorrower: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  borrowerNames: documentChecklistSelectors.getBorrowers(state),
});

const mapDispatchToProps = dispatch => ({
  fetchBorrowersNames: documentChecklistOperations.borrowerNameOperation(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(BorrowerList);
