import React from 'react';
import PropTypes from 'prop-types';
import App from 'components/App';
import Tombstone, { TombstoneLoader } from 'components/Tombstone';
import ContentHeader from 'components/ContentHeader';
import RadioButtonGroup from 'components/RadioButtonGroup';
import LoanTombstone from 'models/LoanTombstone';
import FullHeightColumn from 'components/FullHeightColumn/FullHeightColumn';
import dispositionOptions from 'constants/dispositionOptions';
import UserNotification from 'components/UserNotification/UserNotification';
import './Dashboard.css';

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
    const { user } = this.props;

    return (
      <App user={user}>
        <ContentHeader
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
      </App>
    );
  }
}

Dashboard.propTypes = {
  user: PropTypes.shape({
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};

export default Dashboard;
