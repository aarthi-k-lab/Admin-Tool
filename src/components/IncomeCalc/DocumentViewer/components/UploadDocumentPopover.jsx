import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as R from 'ramda';
import {
  Dialog, DialogTitle, DialogContent, Grid, Typography,
  IconButton, Button, Divider, MenuItem, Select,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import './UploadDocumentPopover.css';
import { selectors as documentChecklistSelectors } from 'ducks/document-checklist';


function UploadDocumentPopover(props) {
  const {
    filenetDocType, selectedFilenetCategory,
    handleFilenetCategory, handleDocUpload, handleUploadClose,
    filenetDocCat, handleFilenetType, selectedFilenetType, isUploadOpen,
  } = props;
  const isUploadDisabled = R.isEmpty(selectedFilenetType) || R.isEmpty(selectedFilenetCategory);
  return (
    <>
      <Dialog open={isUploadOpen}>
        <div style={{ width: '400px' }}>
          <DialogTitle styleName="tag-dialog-title">
            <Grid container>
              <Grid item styleName="tag-dialog-title-name-grid" xs={11}>
                <Typography styleName="tag-dialog-title-name">Preparing to Upload</Typography>
              </Grid>
              <Grid item styleName="tag-dialog-title-icon-item" xs={1}>
                <IconButton onClick={handleUploadClose} styleName="tag-dialog-title-icon-button">
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <Grid container direction="column" spacing={1}>
              <Grid item xs={12}>
                <Grid container direction="column">
                  <Grid item>
                    <Typography styleName="tag-diaglog-content-item-name">
                      Document Category
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Select
                      disableUnderline
                      displayEmpty
                      onChange={handleFilenetCategory}
                      style={{
                        width: '60%',
                      }}
                      value={selectedFilenetCategory}
                      variant="standard"
                    >
                      <MenuItem disabled value="">
                        Select Document Category
                      </MenuItem>
                      {
                          filenetDocCat.map(type => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))
                        }

                    </Select>

                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="column">
                  <Grid item>
                    <Typography styleName="tag-diaglog-content-item-name">
                      Document Type
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Select
                      disableUnderline
                      displayEmpty
                      onChange={handleFilenetType}
                      style={{
                        width: '50%',
                      }}
                      value={selectedFilenetType}
                      variant="standard"
                    >
                      <MenuItem disabled value="">
                        Select Document Type
                      </MenuItem>
                      {
                          filenetDocType.map(type => (
                            <MenuItem
                              key={type.code}
                              name={type.description}
                              value={type.code}
                            >
                              {type.description}
                            </MenuItem>
                          ))
                        }
                    </Select>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Button
                  disabled={isUploadDisabled}
                  onClick={handleDocUpload}
                  styleName={`tag-dialog-content-done-button${isUploadDisabled ? '-disabled' : ''}`}
                  variant="contained"
                >
                UPLOAD
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
}
UploadDocumentPopover.propTypes = {
  filenetDocCat: PropTypes.arrayOf().isRequired,
  filenetDocType: PropTypes.arrayOf(
    PropTypes.shape({
      activeIndicator: PropTypes.number,
      classCode: PropTypes.string,
      classCodeId: PropTypes.number,
      className: PropTypes.string,
      displayText: PropTypes.string,
      errorText: PropTypes.string,
      longDescription: PropTypes.string,
      shortDescription: PropTypes.string,
    }),
  ).isRequired,
  handleDocUpload: PropTypes.func.isRequired,
  handleFilenetCategory: PropTypes.func.isRequired,
  handleFilenetType: PropTypes.func.isRequired,
  handleUploadClose: PropTypes.func.isRequired,
  isUploadOpen: PropTypes.bool.isRequired,
  selectedFilenetCategory: PropTypes.string.isRequired,
  selectedFilenetType: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  filenetDocCat: documentChecklistSelectors.getFilenetDocCategory(state),
  filenetDocType: documentChecklistSelectors.getFilenetDocType(state),
});

export default connect(mapStateToProps, null)(UploadDocumentPopover);
