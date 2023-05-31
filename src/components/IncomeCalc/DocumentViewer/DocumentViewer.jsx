import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as R from 'ramda';
import {
  Checkbox,
  Link,
  Typography,
  Grid,
} from '@material-ui/core';
import {
  selectors as documentChecklistSelectors,
  operations as documentChecklistOperations,
} from 'ducks/document-checklist';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import { operations as notificationOperations } from 'ducks/notifications';
import LightTooltip from './components/LightTooltip';
import LinkPopover from './components/LinkPopover';
import Pagination from './components/Pagination';
import FilterPopover from './components/FilterPopover';
import SearchBar from './components/SearchBar';
import DocNavHeader from './components/DocNavHeader';
import DropZone from './components/DropZone';
import DocumentPopover from './components/DocumentPopover';
import UploadDocumentPopover from './components/UploadDocumentPopover';
import './DocumentViewer.css';
import FileUpload from './components/FileUpload';
import { DateFormatter } from '../../../lib/DateUtils';

const DocumentViewer = (props) => {
  const [searchText, setSearchText] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [popoverId, setPopoverId] = useState('');
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [paginationVal, setPaginationVal] = useState({
    noOfPages: 0,
    docsPerPage: 15,
    currDocPage: 1,
  });
  const [checkedDocumentId, setcheckedDocumentId] = useState([]);
  const [triggerFileUpload, setTriggerFileUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [hoverDoc, setHoverDoc] = useState({});
  const [linkDocPopover, setLinkDocPopover] = useState(false);
  const [checkedFilenetDoc, setcheckedFilenetDoc] = useState([]);
  const [selectedFilenetCategory, setSelectedFilenetCategory] = useState('');
  const [selectedFilenetType, setSelectedFilenetType] = useState('');
  const [selectedFilenetTypeName, setSelectedFilenetTypeName] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const {
    radioSelect, documents, fetchFileNetData,
    setFilterStartDate, setFilterEndDate, setFilterDocCategory,
    setUploadedFiles, uploadedFiles, fetchFilenetDocType, brand, loanNumber,
    setSnackBarValuesTrigger, resetFileNetDocTypes, fetchFilenetTypes,
  } = props;
  useEffect(() => {
    fetchFileNetData();
    fetchFilenetTypes();
  }, []);

  const handleDone = (val) => {
    setLinkDocPopover(val);
    if (!val) {
      setcheckedDocumentId([]);
      setcheckedFilenetDoc([]);
    }
  };

  useEffect(() => {
    handleDone(false);
  }, [radioSelect]);

  const handleSearchChange = (value) => {
    setSearchText(value);
    setPaginationVal({ ...paginationVal, currDocPage: 1 });
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setFilterOpen(false);
  };

  const handleFilterClear = () => {
    setFilterApplied(false);
    setFilterStartDate(null);
    setFilterEndDate(null);
    setFilterDocCategory('');
    fetchFileNetData();
  };

  const handleFilterApply = () => {
    setFilterApplied(true);
    handleFilterClose();
    setPaginationVal({ ...paginationVal, currDocPage: 1 });
    fetchFileNetData();
  };


  const updatePagination = (operation, item) => {
    const { currDocPage, noOfPages } = paginationVal;
    if (operation === 'dec') {
      setPaginationVal({
        ...paginationVal,
        currDocPage:
     (currDocPage <= 1
       ? currDocPage : currDocPage - 1),
      });
    } else if (operation === 'inc') {
      setPaginationVal({
        ...paginationVal,
        currDocPage:
     (currDocPage >= noOfPages
       ? currDocPage : currDocPage + 1),
      });
    } else {
      setPaginationVal({
        ...paginationVal,
        currDocPage: item,
      });
    }
  };

  const checkDocument = (file) => {
    const { fileNetDocId } = file;
    if (checkedDocumentId.includes(fileNetDocId)) {
      setcheckedDocumentId(checkedDocumentId.filter(x => x !== fileNetDocId));
      setcheckedFilenetDoc(checkedFilenetDoc.filter(x => x.fileNetDocId !== fileNetDocId));
    } else {
      setcheckedDocumentId([...checkedDocumentId, fileNetDocId]);
      setcheckedFilenetDoc([...checkedFilenetDoc, file]);
    }
  };

  const getFilteredDocuments = () => {
    const files = [...documents];
    const filteredFiles = files.slice()
      .filter((doc) => {
        if (doc.docTitle) {
          const isDocTitle = R.toUpper(doc.docTitle).includes(R.toUpper(searchText));
          return (isDocTitle);
        }
        return false;
      });
    const pages = Math.ceil(filteredFiles.length / paginationVal.docsPerPage);
    if (pages !== paginationVal.noOfPages) {
      setPaginationVal(
        { ...paginationVal, noOfPages: pages },
      );
    }
    return filteredFiles;
  };

  const handleFilter = (event) => {
    event.preventDefault();
    setFilterAnchorEl(event.currentTarget);
    setFilterOpen(true);
    setPopoverId('simple-popover');
  };

  const selectDocument = (doc) => {
    setSelectedDocument(doc.id);
  };

  const handleDocPopOpen = (event, doc) => {
    setHoverDoc(doc);
  };

  const handleFilenetCategory = (event) => {
    const category = event.target.value;
    setSelectedFilenetCategory(category);
    fetchFilenetDocType(category);
    setSelectedFilenetType('');
    setSelectedFilenetTypeName('');
  };

  const handleFilenetType = (event) => {
    setSelectedFilenetType(event.target.value);
    setSelectedFilenetTypeName(event.currentTarget.innerText);
  };

  const renderListItems = () => {
    const filtered = getFilteredDocuments();
    const endIndex = paginationVal.currDocPage * paginationVal.docsPerPage;
    const startIndex = endIndex - paginationVal.docsPerPage;
    const paginatedDoc = filtered.slice(startIndex, endIndex);
    return paginatedDoc.map(rec => (
      <Grid
        key={rec.fileNetDocId}
        button
        container
        dense
        onClick={() => selectDocument(rec)}
        selected={rec.fileNetDocId === selectedDocument}
        spacing={3}
        styleName={checkedDocumentId.includes(rec.fileNetDocId) ? 'listItemGridChecked' : 'listItemGrid'}
      >
        {radioSelect
          && (
            <Grid item styleName="checkBoxGrid" xs={1}>
              <Checkbox
                checked={checkedDocumentId.includes(rec.fileNetDocId)}
                onClick={() => checkDocument(rec)}
                styleName={checkedDocumentId.includes(rec.fileNetDocId) ? 'checkBoxChecked' : 'checkBox'}
              />
            </Grid>
          )
        }
        {
          rec.fileNetDocId
            ? (
              <Grid
                key={rec.docTitle}
                item
                onMouseEnter={event => handleDocPopOpen(event, rec)}
                primary={rec.docTitle}
                styleName="docNameGrid"
                xs={radioSelect ? 7 : 8}
              >
                <LightTooltip placement="bottom-start" title={<DocumentPopover hoverDoc={hoverDoc} />}>
                  <Typography
                    noWrap
                    styleName="docName"
                  >
                    <Link color="inherit" href={rec.docUrl} rel="noopener noreferrer" target="_blank">
                      {rec.docTitle}
                    </Link>
                  </Typography>
                </LightTooltip>
              </Grid>
            )
            : (
              <Grid
                key={rec.name}
                item
                onMouseEnter={event => handleDocPopOpen(event, rec)}
                primary={rec.name}
                styleName="docNameGrid"
                xs={radioSelect ? 7 : 8}
              >
                <LightTooltip placement="bottom-start" title={<DocumentPopover hoverDoc={hoverDoc} />}>
                  <Typography
                    noWrap
                    styleName="docName"
                  >
                    <Link color="inherit" href={rec.docUrl} rel="noopener noreferrer" target="_blank">
                      {rec.name}
                    </Link>
                  </Typography>
                </LightTooltip>
              </Grid>
            )
        }
        <Grid
          key={rec.fileNetDocId}
          item
          primary={rec.docTitle}
          styleName="docDateGrid"
          xs={4}
        >
          <Typography
            noWrap
            styleName="docDate"
          >
            {DateFormatter(rec.docCreatedDate)}
          </Typography>
        </Grid>
      </Grid>
    ));
  };

  const onDrop = (accFiles) => {
    const files = accFiles.map(file => file);
    setUploadedFiles(files);
    setIsUploadOpen(true);
  };

  const handleDocUpload = () => {
    setIsUploadOpen(false);
    setTriggerFileUpload(true);
  };

  const handleUploadClose = () => {
    setIsUploadOpen(false);
    setUploadedFiles([]);
    setSelectedFilenetCategory('');
    setSelectedFilenetType('');
    setSelectedFilenetTypeName('');
    resetFileNetDocTypes();
  };

  const handleClose = () => {
    setTriggerFileUpload(false);
    setSelectedFilenetCategory('');
    setSelectedFilenetType('');
    setSelectedFilenetTypeName('');
    resetFileNetDocTypes();
    fetchFileNetData();
  };

  const fileMetaData = {
    brand,
    loanNumber,
    setSnackBarValuesTrigger,
    selectedFilenetType,
    selectedFilenetTypeName,
    selectedFilenetCategory,
  };

  const renderFileUpload = () => uploadedFiles.map(file => (
    <FileUpload
      key={file.name}
      data={fileMetaData}
      file={file}
      handleClose={handleClose}
      setUploadedFiles={setUploadedFiles}
      uploadedFiles={uploadedFiles}
    />
  ));
  return (
    <>
      <Grid
        container
        styleName="docMainContainer"
      >
        <Grid item styleName="docSubContainer">
          <DocNavHeader checkedDocument={checkedDocumentId} handleDone={handleDone} />
          <SearchBar
            handleFilter={handleFilter}
            handleSearchChange={handleSearchChange}
            isFilterApplied={isFilterApplied}
            searchText={searchText}
          />
          <div styleName="listContainer">
            {renderListItems()}
          </div>
          {
            !triggerFileUpload
              ? <DropZone onDrop={onDrop} />
              : renderFileUpload()

          }
          <div>
            {paginationVal.noOfPages !== 0
              && (
              <Pagination
                paginationVal={paginationVal}
                updatePagination={updatePagination}
              />
              )
            }
          </div>

        </Grid>
      </Grid>
      <FilterPopover
        filterAnchorEl={filterAnchorEl}
        handleFilterApply={handleFilterApply}
        handleFilterClear={handleFilterClear}
        handleFilterClose={handleFilterClose}
        isFilterOpen={isFilterOpen}
        popoverId={popoverId}
      />
      <LinkPopover
        checkedFilenetDocs={checkedFilenetDoc}
        handleDone={handleDone}
        linkDocPopover={linkDocPopover}
        setLinkDocPopover={setLinkDocPopover}
        type="link"
      />
      <UploadDocumentPopover
        handleDocUpload={handleDocUpload}
        handleFilenetCategory={handleFilenetCategory}
        handleFilenetType={handleFilenetType}
        handleUploadClose={handleUploadClose}
        isUploadOpen={isUploadOpen}
        selectedFilenetCategory={selectedFilenetCategory}
        selectedFilenetType={selectedFilenetType}
        selectedFilenetTypeName={selectedFilenetTypeName}
      />
    </>
  );
};

DocumentViewer.propTypes = {
  brand: PropTypes.string.isRequired,
  currentUser: PropTypes.shape({
    data: PropTypes.object.isRequired,
    groupList: PropTypes.array,
    skills: PropTypes.objectOf(PropTypes.array).isRequired,
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      agentName: PropTypes.string.isRequired,
      docTitle: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      uploadedDate: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  fetchFileNetData: PropTypes.func.isRequired,
  fetchFilenetDocType: PropTypes.func.isRequired,
  fetchFilenetTypes: PropTypes.func.isRequired,
  loanNumber: PropTypes.number.isRequired,
  radioSelect: PropTypes.string.isRequired,
  resetFileNetDocTypes: PropTypes.func.isRequired,
  setFilterDocCategory: PropTypes.func.isRequired,
  setFilterEndDate: PropTypes.func.isRequired,
  setFilterStartDate: PropTypes.func.isRequired,
  setSnackBarValuesTrigger: PropTypes.func.isRequired,
  setUploadedFiles: PropTypes.func.isRequired,
  uploadedFiles: PropTypes.arrayOf().isRequired,
};

const mapStateToProps = state => ({
  radioSelect: documentChecklistSelectors.getRadioSelect(state),
  documents: documentChecklistSelectors.getDocuments(state),
  uploadedFiles: documentChecklistSelectors.getUploadedFiles(state),
  brand: dashboardSelectors.brand(state),
  loanNumber: dashboardSelectors.loanNumber(state),
});

const mapDispatchToProps = dispatch => ({
  setMockData: documentChecklistOperations.setMockDataOpeartion(dispatch),
  fetchFileNetData: documentChecklistOperations.fetchFileNetDataOperation(dispatch),
  setFilterStartDate: documentChecklistOperations.setFilterStartDateOperation(dispatch),
  setFilterEndDate: documentChecklistOperations.setFilterEndDateOperation(dispatch),
  setFilterDocCategory: documentChecklistOperations.setFilterDocCategoryOperation(dispatch),
  setUploadedFiles: documentChecklistOperations.setUploadedFilesOperation(dispatch),
  fetchFilenetDocType: documentChecklistOperations.fetchFilenetTypesOperation(dispatch),
  setSnackBarValuesTrigger: notificationOperations.setSnackBarValuesTrigger(dispatch),
  resetFileNetDocTypes: documentChecklistOperations.resetFileNetDocTypesOperation(dispatch),
  fetchFilenetTypes: documentChecklistOperations.fetchFilenetCatTypesOperation(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentViewer);
