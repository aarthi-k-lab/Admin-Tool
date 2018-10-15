import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import RadioButtonGroup from 'components/RadioButtonGroup';
import UserNotification from 'components/UserNotification/UserNotification';
import dispositionOptions from 'constants/dispositionOptions';
import DispositionModel from 'models/Disposition';
import {
  operations,
  selectors,
} from 'ducks/dashboard';
import './Disposition.css';

class Disposition extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dispositionReason: null,
    };
    this.handleDispositionSelection = this.handleDispositionSelection.bind(this);
    this.handleSave = this.handleSave.bind(this);
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

  handleSave() {
    const { onDispositionSaveTrigger } = this.props;
    const { dispositionReason } = this.state;
    if (dispositionReason) {
      onDispositionSaveTrigger(dispositionReason);
    }
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
    const { dispositionErrorMessages } = this.props;
    const { dispositionReason } = this.state;
    return (
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
    );
  }
}

Disposition.propTypes = {
  dispositionErrorMessages: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClear: PropTypes.func.isRequired,
  onDispositionSaveTrigger: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  dispositionErrorMessages: DispositionModel.getErrorMessages(
    selectors.getDiscrepancies(state),
  ),
});

const mapDispatchToProps = dispatch => ({
  onClear: operations.onClearDisposition(dispatch),
  onDispositionSaveTrigger: operations.onDispositionSave(dispatch),
});

const DispositionContainer = connect(mapStateToProps, mapDispatchToProps)(Disposition);

export default DispositionContainer;
