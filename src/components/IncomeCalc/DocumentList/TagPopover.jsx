import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Dialog, DialogTitle, DialogContent, Grid, Typography, IconButton, Checkbox, Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { selectors as documentChecklistSelectors, operations as documentChecklistOperations } from 'ducks/document-checklist';
import * as PropTypes from 'prop-types';
import './TagPopover.css';

function TagPopover(props) {
  const {
    selectedBorrower, tagPopover, setTagPopover, taggedDocumentName, tagRequired,
    fetchBorrowersNames, borrowerNames, setTagData,
  } = props;
  const [checkedBorrowers, setCheckedBorrowers] = useState([selectedBorrower]);
  useEffect(() => {
    const payload = {
      type: 'tag',
      taggedDocumentName,
      tagRequired,
    };
    fetchBorrowersNames(payload);
  }, [taggedDocumentName]);

  const checkBorrowers = (name) => {
    setCheckedBorrowers(checkedBorrowers.includes(name)
      ? checkedBorrowers.filter(x => x !== name)
      : [...checkedBorrowers, name]);
  };

  const setTagOptions = () => {
    const payload = {
      checkedBorrowers,
      taggedDocumentName,
      required: !tagRequired,
    };
    setTagData(payload);
    setTagPopover(false);
    setCheckedBorrowers([selectedBorrower]);
  };

  const renderOtherBorrowers = () => (
    <>
      {
        borrowerNames && Object.keys(borrowerNames).filter(
          name => name !== selectedBorrower,
        ).map(name => (
          <Grid item>
            <Grid container>
              <Grid item styleName="tag-dialog-check-box" xs={1}>
                <Checkbox
                  checked={checkedBorrowers.includes(name)}
                  onClick={() => checkBorrowers(name)}
                  size="small"
                  style={{
                    height: '15px',
                    width: '15px',
                    color: checkedBorrowers.includes(name) ? '#596FEB' : '#939299',
                  }}
                />
              </Grid>
              <Grid item style={{ padding: '0px' }} xs={11}>
                <Typography styleName="tag-dialog-content-main-name">
                  {borrowerNames[name]}
                </Typography>
                <Typography styleName="tag-dialog-content-name">
                    Borrower
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        ))
      }
    </>
  );

  return (
    <Dialog open={tagPopover}>
      <DialogTitle styleName="tag-dialog-title">
        <Grid container>
          <Grid item styleName="tag-dialog-title-name-grid" xs={11}>
            <Typography styleName="tag-dialog-title-name">
              {
               tagRequired ? 'Mark Document as Optional' : 'Mark Document as Required'
             }
            </Typography>
            <Typography styleName="tag-dialog-title-doc-name">
              {taggedDocumentName}
            </Typography>
          </Grid>
          <Grid item styleName="tag-dialog-title-icon-item" xs={1}>
            <IconButton onClick={() => setTagPopover(false)} styleName="tag-dialog-title-icon-button">
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Grid container direction="column">
          <Grid item>
            <Grid container>
              <Grid item style={{ padding: '0px', marginTop: '1rem' }} xs={1}>
                <Checkbox
                  checked={checkedBorrowers.includes(selectedBorrower)}
                  onClick={() => checkBorrowers(selectedBorrower)}
                  size="small"
                  style={{
                    height: '15px',
                    width: '15px',
                    color: checkedBorrowers.includes(selectedBorrower) ? '#596FEB' : '#939299',
                  }}
                />
              </Grid>
              <Grid item style={{ padding: '0px' }} xs={11}>
                <Typography styleName="tag-dialog-content-main-name">
                  {borrowerNames[selectedBorrower]}
                </Typography>
                <Typography styleName="tag-dialog-content-name">
                    Borrower
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {renderOtherBorrowers()}
          <Grid item style={{ marginTop: '1rem' }}>
            <Grid container>
              <Grid item>
                <Button
                  onClick={setTagOptions}
                  styleName="tag-dialog-content-done-button"
                  variant="contained"
                >
                Done
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => setTagPopover(false)}
                  styleName="tag-dialog-content-cancel-button"
                  variant="contained"
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

TagPopover.propTypes = {
  borrowerNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchBorrowersNames: PropTypes.func.isRequired,
  selectedBorrower: PropTypes.string.isRequired,
  setTagData: PropTypes.func.isRequired,
  setTagPopover: PropTypes.func.isRequired,
  taggedDocumentName: PropTypes.string.isRequired,
  tagPopover: PropTypes.bool.isRequired,
  tagRequired: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  selectedBorrower: documentChecklistSelectors.getSelectedBorrower(state),
  borrowerNames: documentChecklistSelectors.getBorrowers(state),
});

const mapDispatchToProps = dispatch => ({
  fetchBorrowersNames: documentChecklistOperations.borrowerNameOperation(dispatch),
  setTagData: documentChecklistOperations.setTagOperation(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TagPopover);
