import React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import {
  Paper, Typography, Button, Link,
} from '@material-ui/core/index';
import IconButton from '@material-ui/core/IconButton';
import { ExpandLess, ExpandMore } from '@material-ui/icons/index';
import CloseIcon from '@material-ui/icons/Close';
import './IndexingList.css';
import PropTypes from 'prop-types';
import LinkPopover from 'components/IncomeCalc/DocumentViewer/components/LinkPopover';
import Radio from '@material-ui/core/Radio';
import { operations as documentChecklistOperations, selectors as documentChecklistSelectors } from 'ducks/document-checklist';
import Loader from '../../Loader';
import { DECEASED_BORROWER } from '../../../constants/incomeCalc/DocumentList';

class IndexingList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: {},
      documents: null,
      linkDocPopover: false,
      removalDocumentId: 0,
      removalDocumentName: '',
      activeDocumentName: '',
    };
  }

  componentDidMount() {
    const {
      fetchDocTxnDocuments, value,
    } = this.props;
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

  dateFormatter = (date) => {
    if (R.isNil(date)) { return ''; }
    const year = date.slice(0, 4);
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);
    return (`${month}/${day}/${year}`);
  }

  handleRadioClick = documentName => () => {
    const { setRadioSelect } = this.props;
    setRadioSelect({ radioSelect: documentName });
  }

  handleAccordianClick = documentName => () => {
    const { expanded } = this.state;
    const isOpen = R.propOr(false, documentName, expanded);
    this.setState({
      expanded: { ...expanded, [documentName]: !isOpen },
      activeDocumentName: documentName,
    });
  };

  handleLinkPopover = () => {
    this.setState({ linkDocPopover: false, removalDocumentId: 0, removalDocumentName: '' });
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

  handleLinkPopover = () => {
    this.setState({ linkDocPopover: false, removalDocumentId: 0, removalDocumentName: '' });
  }

  render() {
    const {
      loader, selectedBorrower, errorFields, radioSelect,
    } = this.props;
    const {
      documents, expanded, linkDocPopover, removalDocumentName,
      removalDocumentId, activeDocumentName,
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
                            documentName, linkedDocuments, docTxnId, required,
                          } = item;
                          const errors = errorFields[docTxnId] || [];
                          const errorStyle = errors.length > 0 ? 'error' : '';
                          const selectedStyleName = documentName === activeDocumentName ? 'selected' : '';
                          const isDeceased = selectedBorrower.includes(DECEASED_BORROWER);
                          const disableDocChecklist = isDeceased ? 'doc-disable' : '';
                          return (
                            <Paper key={documentName} styleName={`doc-container ${disableDocChecklist} ${selectedStyleName} ${errorStyle}`} variant="outlined">
                              <div styleName="accordian-header">
                                <div styleName="left-header">
                                  <Radio
                                    checked={documentName === radioSelect}
                                    checkedIcon={(
                                      <Button
                                        disabled
                                        styleName="link-doc-button-disable"
                                        variant="contained"
                                      >
                                          Link Doc
                                      </Button>
                                       )}
                                    icon={(
                                      <Button
                                        styleName="link-doc-button"
                                        variant="contained"
                                      >
                                          Link Doc
                                      </Button>
                                        )}
                                    onChange={this.handleRadioClick(documentName)}
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
                                  <p styleName="typography">{documentName}</p>
                                </div>
                                <div styleName="right-header">
                                  {R.propOr(false, documentName, expanded)
                                    ? <ExpandLess onClick={this.handleAccordianClick(documentName)} styleName="cursor" />
                                    : <ExpandMore onClick={this.handleAccordianClick(documentName)} styleName="cursor" />
                                  }
                                </div>
                              </div>
                              {R.propOr(false, documentName, expanded) && (
                                linkedDocuments.map((doc, docIndex) => (
                                  <div styleName="linked-document-container">
                                    <IconButton
                                      aria-label="close"
                                      onClick={this.handleRemoveLink(index, docIndex)}
                                    >
                                      <CloseIcon />
                                    </IconButton>
                                    <Link color="inherit" href={doc.docUrl} rel="noopener noreferrer" target="_blank">
                                      <Typography variant="h2">{doc.docTitle}</Typography>
                                    </Link>
                                    <Typography variant="body2">
                                      Uploaded On
                                      <span>{this.dateFormatter(doc.docCreatedDate)}</span>
                                    </Typography>
                                    <Typography variant="body2">
                                      By
                                      <span>{doc.docCreator}</span>
                                    </Typography>
                                  </div>
                                ))
                              )}
                            </Paper>
                          );
                        })
                      }
                      <LinkPopover
                        linkDocPopover={linkDocPopover}
                        removalDocumentId={removalDocumentId}
                        removalDocumentName={removalDocumentName}
                        setLinkDocPopover={this.handleLinkPopover}
                        source="indexer"
                        type="unlink"
                      />
                    </div>
                  )}
            </div>
          )}
      </>
    );
  }
}

IndexingList.propTypes = {
  errorFields: PropTypes.shape().isRequired,
  fetchDocTxnDocuments: PropTypes.func.isRequired,
  loader: PropTypes.bool.isRequired,
  radioSelect: PropTypes.string.isRequired,
  selectedBorrower: PropTypes.string.isRequired,
  setRadioSelect: PropTypes.func.isRequired,
  value: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  errorFields: documentChecklistSelectors.getErrorFields(state),
  value: documentChecklistSelectors.getDocChecklistData(state),
  loader: documentChecklistSelectors.getLoader(state),
  selectedBorrower: documentChecklistSelectors.getSelectedBorrower(state),
  radioSelect: documentChecklistSelectors.getRadioSelect(state),
});

const mapDispatchToProps = dispatch => ({
  fetchDocTxnDocuments: documentChecklistOperations.setDocChecklistDataOperation(dispatch),
  setRadioSelect: documentChecklistOperations.radioSelectOperation(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(IndexingList);
