import React from 'react';
import Tombstone, { TombstoneLoader } from 'components/Tombstone';
import ContentHeader from 'components/ContentHeader';
import RadioButtonGroup from 'components/RadioButtonGroup';
import LoanTombstone from 'models/LoanTombstone';
import { connect } from 'react-redux';
import FullHeightColumn from 'components/FullHeightColumn/FullHeightColumn';
import dispositionOptions from 'constants/dispositionOptions';
import UserNotification from 'components/UserNotification/UserNotification';
import './Dashboard.css';
import {
  operations as dashboardOperations,
  selectors as dashboardSelectors,
} from 'ducks/dashboard';
import PropTypes from 'prop-types';

class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadingTombstoneData: true,
      tombstoneData: [],
    };

    this.sampleLoans = [596400243, 596400270];
    this.loansIndex = 0;
    this.handleGetNext = this.handleGetNext.bind(this);
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

  handleGetNext() {
    this.loansIndex = (this.loansIndex + 1) % this.sampleLoans.length;
    this.fetchLoanTombstoneData(this.sampleLoans[this.loansIndex]);
  }

  renderTombstone() {
    const { loadingTombstoneData, tombstoneData } = this.state;
    const tombstone = loadingTombstoneData
      ? <TombstoneLoader />
      : <Tombstone items={tombstoneData} />;
    return tombstone;
  }

  render() {
    const tombstone = this.renderTombstone();
    const { onExpandTrigger } = this.props;
    return (
      <>
        <ContentHeader
          onExpand={onExpandTrigger}
          onGetNext={this.handleGetNext}
          showEndShift
          showGetNext
          title="Document Verification"
        />
        {tombstone}
        <FullHeightColumn styleName="disposition-section-container">
          <section styleName="disposition-section">
            <header styleName="title">Please Select the Outcome Of Your Review</header>
            <UserNotification level="error" message="This is a error message!" type="alert-box" />
            <RadioButtonGroup items={dispositionOptions} name="disposition-options" />
          </section>
        </FullHeightColumn>
      </>
    );
  }
}

const mapStateToProps = state => ({
  expandView: dashboardSelectors.expandView(state),
});

const mapDispatchToProps = dispatch => ({
  onExpandTrigger: dashboardOperations.onExpand(dispatch),
});

Dashboard.propTypes = {
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
