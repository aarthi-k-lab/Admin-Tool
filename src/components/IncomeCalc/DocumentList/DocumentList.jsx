/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import History from '@material-ui/icons/History';
import CloseIcon from '@material-ui/icons/Close';
import Popover from '@material-ui/core/Popover';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckIcon from '@material-ui/icons/Check';
import TextField from '@material-ui/core/TextField';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import ExpandLess from '@material-ui/icons/ExpandLess';
import CommentOutlined from '@material-ui/icons/CommentOutlined';
import Radio from '@material-ui/core/Radio';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { operations as documentChecklistOperations, selectors as documentChecklistSelectors } from 'ducks/document-checklist';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import { selectors as widgetsSelectors } from 'ducks/widgets';
import { DOCUMENT_CHECKLIST } from '../../../constants/widgets';
import { PROPERTY_PRIMARY_USE, DECEASED_BORROWER } from '../../../constants/incomeCalc/DocumentList';
import './DocumentList.css';
import DocumentHistoryModal from './DocumentHistoryModal';
import ExpTag from './ExpTag';
import LinkPopover from '../DocumentViewer/components/LinkPopover';
import TagPopover from './TagPopover';
import Loader from '../../Loader';


class DocumentList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editCheckBox: null,
      anchorDocReasons: {},
      anchorMoreOptions: {},
      editedComment: null,
      editText: null,
      expanded: {},
      anchorDocReview: {},
      documents: null,
      openHistoryModel: null,
      linkDocPopover: false,
      removalDocumentId: 0,
      removalDocumentName: '',
      tagPopover: false,
      taggedDocumentName: '',
      tagRequired: false,
    };
  }

  componentDidMount() {
    const {
      docReviewStatusDropdown,
      fetchDocTxnDocuments, value,
    } = this.props;
    docReviewStatusDropdown(PROPERTY_PRIMARY_USE);
    if (R.isEmpty(value) || R.isNil(value)) { fetchDocTxnDocuments(); }
  }

  componentDidUpdate(prevProps) {
    const { selectedBorrower, setRadioSelect } = this.props;

    if (prevProps.selectedBorrower !== selectedBorrower) {
      setRadioSelect('');
    }
  }

  static getDerivedStateFromProps(props) {
    const {
      value, selectedBorrower,
    } = props;
    const data = R.propOr([], 'documents', R.find(R.propEq('borrowerName',
      selectedBorrower))(value));
    if (data) {
      return { documents: data };
    }
    return null;
  }

  handleOpenHistoryModel = index => () => {
    const { fetchDocHistory } = this.props;
    const { documents } = this.state;
    const docTxnId = R.propOr(0, 'docTxnId', R.nth(index, documents));
    fetchDocHistory({ docTxnId });
    this.setState({ openHistoryModel: index });
  }

  handleCloseHistoryModel = () => {
    this.setState({ openHistoryModel: null });
  }

  handleLinkPopover = () => {
    this.setState({ linkDocPopover: false, removalDocumentId: 0, removalDocumentName: '' });
  }

  handleTagPopover = () => {
    this.setState({ tagPopover: false, taggedDocumentName: '', tagRequired: false });
  }

  handleAccordianClick = documentName => () => {
    const { expanded } = this.state;
    const isOpen = R.propOr(false, documentName, expanded);
    this.setState({ expanded: { ...expanded, [documentName]: !isOpen } });
  };

  handleClick = index => (event) => {
    const { anchorDocReview } = this.state;
    this.setState({ anchorDocReview: { ...anchorDocReview, [index]: event.currentTarget } });
  };

  handleClose = index => () => {
    const { anchorDocReview } = this.state;
    this.setState({ anchorDocReview: { ...anchorDocReview, [index]: null } });
  }

  handleMenuClick = (index, docTxnId) => (event) => {
    const { anchorDocReview } = this.state;
    const { changeDocumentDetails } = this.props;
    this.setState({
      anchorDocReview: { ...anchorDocReview, [index]: null },
    });
    changeDocumentDetails({ key: 'documentReviewStatus', value: event.currentTarget.innerText, docTxnId });
  };

  handleRadioClick = documentName => () => {
    const { setRadioSelect } = this.props;
    setRadioSelect({ radioSelect: documentName });
  }

  handleDateChange = (index, docTxnId) => (selectedDate) => {
    const { changeDocumentDetails } = this.props;
    if (selectedDate && selectedDate.isValid()) {
      changeDocumentDetails({ key: 'expirationDate', value: selectedDate, docTxnId });
    }
  }

  handleEditClick = index => () => {
    const { documents } = this.state;
    const editedComment = R.pathOr('', [index, 'comments'], documents);
    this.setState({ editText: index, editedComment });
  }

  handleTextChange = (event) => {
    this.setState({ editedComment: event.target.value });
  }

  handleCommentUpdate = (index, docTxnId) => () => {
    const { editedComment } = this.state;
    const { changeDocumentDetails } = this.props;
    this.setState({ editedComment: null, editText: null });
    changeDocumentDetails({ key: 'comments', value: editedComment, docTxnId });
  }

  handleDocReasonClick = index => (event) => {
    const { anchorDocReasons, documents } = this.state;
    const { defectReasonDropdown, defectReasonOptions } = this.props;
    const docReasons = R.pathOr([], [index, 'docReasons'], documents);
    this.setState({
      editCheckBox: anchorDocReasons[index] ? null : docReasons,
      anchorDocReasons: {
        ...anchorDocReasons,
        [index]: anchorDocReasons[index]
          ? null : event.currentTarget,
      },
    });
    const docName = R.pathOr('', [index, 'documentName'], documents);
    if (!defectReasonOptions[docName]
      || defectReasonOptions[docName].length === 0) {
      defectReasonDropdown(docName);
    }
  }

  handCheckboxClick = checkBoxItem => (event) => {
    const { editCheckBox } = this.state;
    this.setState({
      editCheckBox: event.target.checked
        ? [...editCheckBox, checkBoxItem]
        : R.without([checkBoxItem], editCheckBox),
    });
  };


  handleDoneClick = (index, docTxnId) => () => {
    const { editCheckBox, anchorDocReasons } = this.state;
    const { changeDocumentDetails } = this.props;
    this.setState({
      editCheckBox: null,
      anchorDocReasons: { ...anchorDocReasons, [index]: null },
    });
    changeDocumentDetails({ key: 'docReasons', value: editCheckBox, docTxnId });
  }

  getDefectReasonText = (docReasons, index) => {
    const { documents } = this.state;
    const docName = R.pathOr('', [index, 'documentName'], documents);
    const { defectReasonOptions, defectReasonDropdown } = this.props;
    if (docReasons.length > 0
      && (R.isEmpty(defectReasonOptions[docName]) || R.isNil(defectReasonOptions[docName]))) {
      defectReasonDropdown(docName);
    }
    const dftData = defectReasonOptions[docName]
      ? defectReasonOptions[docName].reduce((acc, curr) => {
        if (docReasons.includes(curr.docDefectId)) {
          return [...acc, curr.defectReason];
        }
        return acc;
      }, []) : [];
    return dftData;
  }

  getDocReasonText = (index) => {
    const { documents } = this.state;
    const docReasons = R.pathOr([], [index, 'docReasons'], documents);
    const defectReasonText = this.getDefectReasonText(docReasons, index);
    const formattedString = R.join(',', defectReasonText);
    const text = R.remove(12, formattedString.length, formattedString).join('');
    const additionalCound = R.length(docReasons) - R.length(R.match(/,/g, text)) - 1;
    return text ? `${text}...+${additionalCound}` : 'Select Doc Reason(s)';
  }

  handleOpenMoreOptions = index => (event) => {
    const { anchorMoreOptions } = this.state;
    this.setState({ anchorMoreOptions: { ...anchorMoreOptions, [index]: event.currentTarget } });
  }

  handleCloseMoreOptions = (index, required) => () => {
    const { anchorMoreOptions, documents } = this.state;
    if (!R.isNil(required)) {
      const taggedDocumentName = R.propOr('', 'documentName', R.nth(index, documents));
      this.setState({
        tagPopover: true, taggedDocumentName, tagRequired: required,
      });
    }
    this.setState({ anchorMoreOptions: { ...anchorMoreOptions, [index]: null } });
  }

  handleRemoveLink = (index, linkedDoc) => () => {
    const { documents } = this.state;
    const removalDocumentName = R.propOr('', 'documentName', R.nth(index, documents));
    const linkedDocuments = R.propOr([], 'linkedDocuments', R.nth(index, documents));
    const removalDocumentId = R.propOr('', 'fileNetDocId', R.nth(linkedDoc, linkedDocuments));
    this.setState({
      linkDocPopover: true, removalDocumentId, removalDocumentName,
    });
  }

  dateFormatter = (date) => {
    if (R.isNil(date)) { return ''; }
    const year = date.slice(0, 4);
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);
    return (`${month}/${day}/${year}`);
  }

  renderInput = p => (
    <Typography onChange={p.onChange} onClick={p.onClick} style={{ cursor: 'pointer' }}>
      {p.value}
    </Typography>
  );

  render() {
    const {
      docReviewStatusOptions, errorFields,
      defectReasonOptions, radioSelect, openWidgetList, isAssigned, selectedBorrower,
      loader,
    } = this.props;
    const {
      documents,
      linkDocPopover,
      removalDocumentName, removalDocumentId, tagPopover, tagRequired, taggedDocumentName,
    } = this.state;
    const isDocWidgetNotInProc = R.contains(DOCUMENT_CHECKLIST, openWidgetList);
    const {
      anchorDocReview, expanded, openHistoryModel, editText, editedComment,
      anchorDocReasons, editCheckBox, anchorMoreOptions,
    } = this.state;
    return (
      <>

        {
          loader ? <Loader />
            : (
              <div>
                {
                  R.isEmpty(documents)
                    ? (
                      <div>
                        <Typography
                          styleName="no-data"
                          variant="h6"
                        >
                          {'No Documents Found'}
                        </Typography>
                      </div>
                    )
                    : (
                      <div>
                        {
                          documents.map((item, index) => {
                            const {
                              documentName, linkedDocuments, expirationDate,
                              documentReviewStatus, required, comments, docTxnId,
                            } = item;
                            const errors = errorFields[docTxnId] || [];
                            const selectedStyleName = documentName === radioSelect ? 'selected' : '';
                            const errorStyle = errors.length > 0 ? 'error' : '';
                            const docReviewError = errors.includes('documentReviewStatus') ? 'docReviewError' : '';
                            const expirationDateError = errors.includes('expirationDate') ? 'expirationDateError' : '';
                            const isDeceased = selectedBorrower.includes(DECEASED_BORROWER);
                            const disableStyle = (!isAssigned || isDocWidgetNotInProc) ? 'doc-disable' : '';
                            const disableDocChecklist = isDeceased ? 'doc-disable' : '';
                            const isLinkedDocPresent = linkedDocuments.length > 0;
                            let text = '';
                            if (documentReviewStatus === 'Defects') { text = this.getDocReasonText(index); }
                            return (
                              <Paper key={documentName} styleName={`doc-container ${disableDocChecklist} ${selectedStyleName} ${errorStyle}`} variant="outlined">
                                <div styleName="accordian-header">
                                  <div styleName="left-header">
                                    <Radio
                                      checked={documentName === radioSelect}
                                      checkedIcon={(
                                        <Button
                                          disabled
                                          styleName={`link-doc-button-disable ${disableStyle}`}
                                          variant="contained"
                                        >
                                          Link Doc
                                        </Button>
                                       )}
                                      icon={(
                                        <Button
                                          styleName={`link-doc-button ${disableStyle}`}
                                          variant="contained"
                                        >
                                          Link Doc
                                        </Button>
                                        )}
                                      onChange={this.handleRadioClick(documentName)}
                                      styleName={disableStyle}
                                      value={documentName}
                                    />
                                    {
                                      required ? (
                                        <span
                                          style={{
                                            backgroundColor: '#F03858',
                                            padding: '2px 5px',
                                            borderRadius: 3,
                                            color: '#fff',
                                            marginRight: 8,
                                          }}
                                        >
                                          REQ
                                        </span>
                                      ) : ''}
                                    <ExpTag expDate={expirationDate} />
                                    <p styleName="typography">{documentName}</p>
                                  </div>
                                  <div styleName="right-header">
                                    <History onClick={this.handleOpenHistoryModel(index)} styleName="cursor" />
                                    <MoreVertIcon onClick={this.handleOpenMoreOptions(index)} styleName={`cursor ${disableStyle}`} />
                                    <Menu
                                      anchorEl={anchorMoreOptions[index]}
                                      id="simple-menu"
                                      keepMounted
                                      onClose={this.handleCloseMoreOptions(index, null)}
                                      open={Boolean(anchorMoreOptions[index])}
                                    >
                                      <MenuItem onClick={
                                        this.handleCloseMoreOptions(index, required)}
                                      >
                                        {required ? 'Mark as Not required' : 'Mark as required'}
                                      </MenuItem>
                                    </Menu>
                                    {R.propOr(false, documentName, expanded)
                                      ? <ExpandLess onClick={this.handleAccordianClick(documentName)} styleName="cursor" />
                                      : <ExpandMore onClick={this.handleAccordianClick(documentName)} styleName="cursor" />}
                                  </div>
                                </div>
                                <div styleName="doc-components">
                                  <div styleName="doc-review">
                                    <Typography>Doc Review Status</Typography>
                                    <Button
                                      endIcon={<ArrowDropDownIcon />}
                                      onClick={this.handleClick(index)}
                                      styleName={disableStyle}
                                    >
                                      {documentReviewStatus || 'Select'}
                                    </Button>
                                    <Menu
                                      anchorEl={R.propOr(null, index, anchorDocReview)}
                                      id={index}
                                      keepMounted
                                      onClose={this.handleClose(index)}
                                      open={Boolean(R.propOr(null, index, anchorDocReview))}
                                    >
                                      {docReviewStatusOptions
                                        && docReviewStatusOptions.map(({
                                          requestType, displayText,
                                        }) => (
                                          <MenuItem
                                            key={requestType}
                                            disabled={!isLinkedDocPresent}
                                            onClick={
                                              this.handleMenuClick(index, docTxnId)}
                                            value={requestType}
                                          >
                                            {displayText}
                                          </MenuItem>
                                        ))
                                        }
                                    </Menu>
                                  </div>

                                  {R.equals(documentReviewStatus, 'Defects') && (
                                  <div styleName={`doc-reason ${docReviewError}`}>
                                    <Typography>Doc Reason(s)</Typography>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                      <Typography
                                        onClick={this.handleDocReasonClick(index)}
                                        styleName="cursor"
                                        tabindex="0"
                                      >
                                        {text}
                                      </Typography>
                                      <ArrowDropDownIcon
                                        onClick={this.handleDocReasonClick(index)}
                                        styleName="cursor"
                                      />
                                    </div>
                                    <Popover
                                      anchorEl={anchorDocReasons[index]}
                                      anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                      }}
                                      onClose={this.handleDocReasonClick(index)}
                                      open={Boolean(anchorDocReasons[index])}
                                      transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                      }}
                                      transition
                                    >
                                      <Paper styleName="checkbox-list">
                                        <div styleName="checkbox-component">
                                          {defectReasonOptions[documentName]
                                            && defectReasonOptions[documentName].map(
                                              checkBoxItem => (
                                                <FormControlLabel
                                                  control={(
                                                    <Checkbox
                                                      checked={
                                                      R.contains(
                                                        checkBoxItem.docDefectId, editCheckBox
                                                        || [],
                                                      )
                                                    }
                                                      color="primary"
                                                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                      onChange={
                                                      this.handCheckboxClick(
                                                        checkBoxItem.docDefectId,
                                                      )}
                                                    />
                                                )
                                              }
                                                  label={checkBoxItem.defectReason}
                                                  styleName={disableStyle}
                                                />
                                              ),
                                            )}
                                        </div>
                                        <Divider />
                                        <Button
                                          color="primary"
                                          onClick={this.handleDoneClick(index, docTxnId)}
                                          styleName={`done-button ${disableStyle}`}
                                          variant="contained"
                                        >
                                                    Done
                                        </Button>
                                      </Paper>
                                    </Popover>
                                  </div>
                                  )}

                                  <div styleName={`doc-expiration ${expirationDateError}`}>
                                    <Typography>Expiration</Typography>
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                      <DatePicker
                                        autoOk
                                        disablePast
                                        emptyLabel="MM/DD/YYYY"
                                        error={false}
                                        format="MM/DD/YYYY"
                                        helperText={null}
                                        InputProps={{
                                          disableUnderline: true,
                                        }}
                                        maxDate={moment().add(1, 'years').format('MM/DD/YYYY')}
                                        onChange={this.handleDateChange(index, docTxnId)}
                                        PopoverProps={{
                                          anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                                          transformOrigin: { vertical: 'top', horizontal: 'left' },
                                        }}
                                        styleName={disableStyle}
                                        value={(R.isNil(expirationDate)
                                           || R.isEmpty(expirationDate))
                                          ? null : expirationDate}
                                        variant="inline"
                                      />
                                    </MuiPickersUtilsProvider>
                                  </div>

                                  <div styleName="doc-comments">
                                    <CommentOutlined />
                                    {R.equals(editText, index)
                                      ? (
                                        <div styleName="editText">
                                          <TextField
                                            onChange={this.handleTextChange}
                                            value={editedComment}
                                          />
                                          <CheckIcon
                                            onClick={this.handleCommentUpdate(index, docTxnId)}
                                            styleName="cursor"
                                          />
                                          <CloseIcon
                                            onClick={this.handleEditClick(null)}
                                            styleName="cursor"
                                          />
                                        </div>
                                      ) : (
                                        <Typography
                                          onClick={this.handleEditClick(index)}
                                          styleName={`comment cursor ${disableStyle}`}
                                          tabindex="0"
                                        >
                                          {(R.isNil(comments) || R.isEmpty(comments)) ? 'Add comments' : comments}
                                        </Typography>
                                      )}
                                  </div>

                                </div>
                                {R.propOr(false, documentName, expanded) && (
                                <div styleName="linked-docs-contianer">
                                  <Typography styleName="linked-typography">Linked Documents</Typography>
                                  <div styleName="linked-docs">
                                    {linkedDocuments.map((doc, docIndex) => (
                                      <div styleName="document-container">
                                        <div styleName="linked-doc-header">
                                          <Link color="inherit" href={doc.docUrl} rel="noopener noreferrer" target="_blank">
                                            <p styleName="linked-doc-header-title">{doc.docTitle}</p>
                                          </Link>
                                          <CloseOutlinedIcon
                                            onClick={this.handleRemoveLink(index, docIndex)}
                                            styleName={`cursor ${disableStyle}`}
                                          />
                                        </div>
                                        <div styleName="linked-doc-content">
                                          <p styleName="linked-doc-title">Uploaded On</p>
                                          <p styleName="linked-doc-value">{this.dateFormatter(doc.docCreatedDate)}</p>
                                        </div>
                                        <div styleName="linked-doc-content">
                                          <p styleName="linked-doc-title">By</p>
                                          <p styleName="linked-doc-value">{doc.docCreator}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                )}
                              </Paper>
                            );
                          })}

                        <DocumentHistoryModal
                          documentName={R.propOr('', 'documentName', R.nth(openHistoryModel, documents))}
                          handleClose={this.handleCloseHistoryModel}
                          isOpen={!R.isNil(openHistoryModel)}
                        />
                        <LinkPopover
                          linkDocPopover={linkDocPopover}
                          removalDocumentId={removalDocumentId}
                          removalDocumentName={removalDocumentName}
                          setLinkDocPopover={this.handleLinkPopover}
                          source="docChecklist"
                          type="unlink"
                        />
                        <TagPopover
                          setTagPopover={this.handleTagPopover}
                          taggedDocumentName={taggedDocumentName}
                          tagPopover={tagPopover}
                          tagRequired={tagRequired}
                        />
                      </div>
                    )
                    }
              </div>
            )
         }

      </>

    );
  }
}

DocumentList.defaultProps = {
  openWidgetList: [],
};


DocumentList.propTypes = {
  changeDocumentDetails: PropTypes.func.isRequired,
  defectReasonDropdown: PropTypes.func.isRequired,
  defectReasonOptions: PropTypes.shape().isRequired,
  docReviewStatusDropdown: PropTypes.func.isRequired,
  docReviewStatusOptions: PropTypes.shape().isRequired,
  errorFields: PropTypes.shape().isRequired,
  fetchDocHistory: PropTypes.func.isRequired,
  fetchDocTxnDocuments: PropTypes.func.isRequired,
  isAssigned: PropTypes.bool.isRequired,
  loader: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string.isRequired,
  }).isRequired,
  openWidgetList: PropTypes.arrayOf(PropTypes.string),
  radioSelect: PropTypes.string.isRequired,
  selectedBorrower: PropTypes.string.isRequired,
  setRadioSelect: PropTypes.func.isRequired,
  value: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  value: documentChecklistSelectors.getDocChecklistData(state),
  docReviewStatusOptions: documentChecklistSelectors.getDocReviewStatusDropdown(state),
  errorFields: documentChecklistSelectors.getErrorFields(state),
  selectedBorrower: documentChecklistSelectors.getSelectedBorrower(state),
  defectReasonOptions: documentChecklistSelectors.getDefectReasonDropdown(state),
  radioSelect: documentChecklistSelectors.getRadioSelect(state),
  openWidgetList: widgetsSelectors.getOpenWidgetList(state),
  isAssigned: dashboardSelectors.isAssigned(state),
  loader: documentChecklistSelectors.getLoader(state),
});

const mapDispatchToProps = dispatch => ({
  setRadioSelect: documentChecklistOperations.radioSelectOperation(dispatch),
  docReviewStatusDropdown:
  documentChecklistOperations.docReviewStatusDropdownOperation(dispatch),
  changeDocumentDetails: documentChecklistOperations.changeDocumentDetails(dispatch),
  fetchDocTxnDocuments: documentChecklistOperations.setDocChecklistDataOperation(dispatch),
  defectReasonDropdown: documentChecklistOperations.defectReasonDropdownOperation(dispatch),
  fetchDocHistory: documentChecklistOperations.fetchDocHistoryOperation(dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(DocumentList);
