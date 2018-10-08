import React from 'react';
import Button from '@material-ui/core/Button';
import Tombstone, { TombstoneLoader } from 'components/Tombstone';
import ContentHeader from 'components/ContentHeader';
import RadioButtonGroup from 'components/RadioButtonGroup';
import LoanTombstone from 'models/LoanTombstone';
import { connect } from 'react-redux';
import FullHeightColumn from 'components/FullHeightColumn/FullHeightColumn';
import dispositionOptions from 'constants/dispositionOptions';
import LeftTaskPane from 'components/LeftTaskPane';
import UserNotification from 'components/UserNotification/UserNotification';
import Disposition from 'models/Disposition';
import './Dashboard.css';
import {
  operations as dashboardOperations,
  selectors as dashboardSelectors,
} from 'ducks/dashboard';
import PropTypes from 'prop-types';
import isFeatureEnabled from 'lib/FeatureUtils';

class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dispositionReason: null,
      loadingTombstoneData: true,
      tombstoneData: [],
    };

    this.sampleLoans = [596400243, 596400270];
    this.loansIndex = 0;
    this.handleGetNext = this.handleGetNext.bind(this);
    this.handleDispositionSelection = this.handleDispositionSelection.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.fetchLoanTombstoneData(this.sampleLoans[this.loansIndex]);
  }

  fetchLoanTombstoneData(loanNumber) {
    this.setState({
      loadingTombstoneData: true,
    });
    LoanTombstone.fetchData(loanNumber)
      .then((data) => {
        this.setState({
          loadingTombstoneData: false,
          tombstoneData: data,
        });
      })
      .catch(console.error);
  }

  handleDispositionSelection(option) {
    const { dispositionReason } = this.state;
    const { onClear } = this.props;
    if (dispositionReason && option !== dispositionReason) {
      onClear();
    }
    this.setState({
      dispositionReason: option,
    });
  }

  handleGetNext() {
    this.loansIndex = (this.loansIndex + 1) % this.sampleLoans.length;
    this.fetchLoanTombstoneData(this.sampleLoans[this.loansIndex]);
  }

  handleSave() {
    const { onDispositionSaveTrigger } = this.props;
    const { dispositionReason } = this.state;
    if (dispositionReason) {
      onDispositionSaveTrigger(dispositionReason);
    }
  }

  renderTombstone() {
    const { loadingTombstoneData, tombstoneData } = this.state;
    const tombstone = loadingTombstoneData
      ? <TombstoneLoader />
      : <Tombstone items={tombstoneData} />;
    return tombstone;
  }

  renderErrorNotification() {
    const { dispositionErrorMessages: errorMessages } = this.props;
    if (errorMessages.length > 0) {
      const errorsNode = errorMessages.reduce(
        (acc, message) => {
          acc.push(message);
          acc.push(<br key={message} />);
          return acc;
        },
        [],
      );
      return (
        <UserNotification level="error" message={errorsNode} type="alert-box" />
      );
    }
    return null;
  }

  render() {
    const tombstone = this.renderTombstone();
    const {
      dispositionErrorMessages,
      enableGetNext,
      features,
      onExpandTrigger,
    } = this.props;
    const { dispositionReason } = this.state;
    return (
      <>
        <ContentHeader
          enableGetNext={enableGetNext}
          onExpand={onExpandTrigger}
          onGetNext={this.handleGetNext}
          showEndShift
          showGetNext
          title="Document Verification"
        />
        {tombstone}
        <FullHeightColumn styleName="disposition-section-container">
          {isFeatureEnabled('taskPane', features) ? <LeftTaskPane /> : null}
          <div styleName="scrollable-block">
            <section styleName="disposition-section">
              <header styleName="title">Please select the outcome of your review</header>
              {this.renderErrorNotification()}
              <RadioButtonGroup
                items={dispositionOptions}
                name="disposition-options"
                onChange={this.handleDispositionSelection}
              />
              <Button
                className="material-ui-button"
                color="primary"
                disabled={!dispositionReason}
                onClick={this.handleSave}
                styleName="save-button"
                variant="contained"
              >
                {dispositionErrorMessages.length ? 'Retry' : 'Save'}
              </Button>
            </section>
          </div>
        </FullHeightColumn>
      </>
    );
  }
}

const mapStateToProps = state => ({
  enableGetNext: dashboardSelectors.enableGetNext(state),
  dispositionErrorMessages: Disposition.getErrorMessages(
    dashboardSelectors.getDiscrepancies(state),
  ),
  expandView: dashboardSelectors.expandView(state),
});

const mapDispatchToProps = dispatch => ({
  onClear: dashboardOperations.onClearDisposition(dispatch),
  onExpandTrigger: dashboardOperations.onExpand(dispatch),
  onDispositionSaveTrigger: dashboardOperations.onDispositionSave(dispatch),
});

Dashboard.propTypes = {
  dispositionErrorMessages: PropTypes.arrayOf(PropTypes.string).isRequired,
  enableGetNext: PropTypes.bool.isRequired,
  features: PropTypes.shape({
    taskPane: PropTypes.bool,
  }).isRequired,
  onClear: PropTypes.func.isRequired,
  onDispositionSaveTrigger: PropTypes.func.isRequired,
  onExpandTrigger: PropTypes.func.isRequired,
  user: PropTypes.shape({
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
