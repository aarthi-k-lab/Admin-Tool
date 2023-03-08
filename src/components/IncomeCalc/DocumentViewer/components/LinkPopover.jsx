import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Checkbox,
  Divider,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { selectors as documentChecklistSelectors, operations as documentChecklistOperations } from 'ducks/document-checklist';
import * as PropTypes from 'prop-types';
import BorrowerList from '../BorrowerList';
import './LinkPopover.css';

const LinkPopover = (props) => {
  const {
    linkDocPopover, setLinkDocPopover,
    selectedBorrower, removalDocumentName, removalDocumentId,
    checkedFilenetDocs, type, borrowerNames,
  } = props;
  const [checkedBorrowers, setCheckedBorrowers] = useState([selectedBorrower]);

  const checkBorrowers = (name) => {
    setCheckedBorrowers(checkedBorrowers.includes(name)
      ? checkedBorrowers.filter(x => x !== name)
      : [...checkedBorrowers, name]);
  };

  const linkDocuments = () => {
    const { linkDocumentsToBorrowers } = props;
    const payload = {
      checkedBorrowers,
      checkedFilenetDocs,
    };
    linkDocumentsToBorrowers(payload);
    setLinkDocPopover(false);
    setCheckedBorrowers([selectedBorrower]);
  };

  const unlinkDocuments = () => {
    const { unlinkDocumentToBorrowers } = props;
    const payload = {
      removalDocumentId,
      removalDocumentName,
      checkedBorrowers,
    };
    unlinkDocumentToBorrowers(payload);
    setLinkDocPopover(false);
    setCheckedBorrowers([selectedBorrower]);
  };

  const renderOtherBorrowers = () => (
    <>
      <BorrowerList
        checkBorrowers={checkBorrowers}
        checkedBorrowers={checkedBorrowers}
        removalDocumentId={removalDocumentId || 0}
        removalDocumentName={removalDocumentName || ''}
        selectedBorrower={selectedBorrower}
        type={type}
      />
    </>
  );

  return (
    <>
      <Dialog
        open={linkDocPopover}
        PaperProps={{
          style: {
            borderRadius: '10px',
            border: '1px solid #4E586E',
          },
        }}
      >
        <DialogTitle styleName="link-pop-dialog-title">
          <Grid container>
            <Grid item styleName="link-pop-grid-title" xs={10}>
              <Typography
                styleName="link-pop-grid-title-name"
              >
                {
                  type === 'link' ? 'Link Document(s)' : 'UnLink Document(s)'
                }
              </Typography>
            </Grid>
            <Grid item styleName="link-pop-grid-close-icon" xs={2}>
              <IconButton onClick={() => setLinkDocPopover(false)} style={{ height: '30px', width: '30px' }}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item styleName="link-pop-grid-item">
              <Typography styleName="link-pop-grid-item-typo">
                Select borrowers
              </Typography>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent styleName="link-pop-dialog-title">
          <Grid container direction="column">
            <Grid container styleName="link-pop-grid-container">
              <Grid item styleName="link-pop-dialog-title" xs={1}>
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
              <Grid item style={{ padding: '0px' }} xs={10}>
                <Typography styleName="link-pop-grid-item-name">
                  {borrowerNames[selectedBorrower]}
                </Typography>
                <Typography styleName="link-pop-grid-item-name-typo">
                Borrower
                </Typography>
              </Grid>
            </Grid>

            <Grid item>
              <Divider />
            </Grid>
            {renderOtherBorrowers()}
            <Grid item>
              <Divider />
            </Grid>
            <Grid display="flex" item style={{ padding: '10px 24px' }}>
              <Button
                onClick={type === 'link' ? linkDocuments : unlinkDocuments}
                styleName="link-pop-link-unlink-button"
                variant="contained"
              >
                {
                type === 'link' ? 'Link' : 'Unlink'
              }
              </Button>
              <Button
                onClick={() => setLinkDocPopover(false)}
                styleName="link-pop-cancel-button"
                variant="contained"
              >
              Cancel

              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

LinkPopover.propTypes = {
  borrowerNames: PropTypes.shape().isRequired,
  checkedFilenetDocs: PropTypes.arrayOf({}).isRequired,
  linkDocPopover: PropTypes.bool.isRequired,
  linkDocumentsToBorrowers: PropTypes.func.isRequired,
  removalDocumentId: PropTypes.number.isRequired,
  removalDocumentName: PropTypes.string.isRequired,
  selectedBorrower: PropTypes.string.isRequired,
  setLinkDocPopover: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  unlinkDocumentToBorrowers: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selectedBorrower: documentChecklistSelectors.getSelectedBorrower(state),
  borrowerNames: documentChecklistSelectors.getBorrowers(state),
});

const mapDispatchToProps = dispatch => ({
  linkDocumentsToBorrowers: documentChecklistOperations.linkDocumentsOperation(dispatch),
  unlinkDocumentToBorrowers: documentChecklistOperations.unlinkDocumentOperation(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LinkPopover);
