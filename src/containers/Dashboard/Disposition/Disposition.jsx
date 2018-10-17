import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import * as R from 'ramda';
import RadioButtonGroup from 'components/RadioButtonGroup';
import UserNotification from 'components/UserNotification/UserNotification';
import dispositionOptions from 'constants/dispositionOptions';
import { confirmationNavigation } from 'constants/messages';
import DispositionModel from 'models/Disposition';
import {
  operations,
  selectors,
} from 'ducks/dashboard';
import './Disposition.css';

class Disposition extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleDispositionSelection = this.handleDispositionSelection.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.confirmNavigation = this.confirmNavigation.bind(this);
  }

  componentWillMount() {
    window.addEventListener('beforeunload', this.confirmNavigation);
  }

  componentWillUnmount() {
    /* istanbul ignore next */
    window.removeEventListener('beforeunload', this.confirmNavigation);
  }

  // eslint-disable-next-line
  confirmNavigation(event) {
    const { enableGetNext, onAutoSave } = this.props;
    /* istanbul ignore else */
    if (!enableGetNext) {
      // eslint-disable-next-line
      event.returnValue = confirmationNavigation;
      onAutoSave();
    }
  }


  handleDispositionSelection(option) {
    const { dispositionReason, onDispositionSelect } = this.props;
    const { onClear } = this.props;
    if (dispositionReason && option !== dispositionReason) {
      onClear();
    }
    onDispositionSelect(option);
  }

  handleSave() {
    const { onDispositionSaveTrigger } = this.props;
    const { dispositionReason } = this.props;
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
    const { dispositionReason } = this.props;
    return (
      <div styleName="scrollable-block">
        <section styleName="disposition-section">
          <header styleName="title">Please select the outcome of your review</header>
          {this.renderErrorNotification()}
          <RadioButtonGroup
            clearSelectedDisposition={R.isEmpty(dispositionReason)}
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

Disposition.defaultProps = {
  enableGetNext: false,
};

Disposition.propTypes = {
  dispositionErrorMessages: PropTypes.arrayOf(PropTypes.string).isRequired,
  dispositionReason: PropTypes.string.isRequired,
  enableGetNext: PropTypes.bool,
  onAutoSave: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onDispositionSaveTrigger: PropTypes.func.isRequired,
  onDispositionSelect: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  dispositionErrorMessages: DispositionModel.getErrorMessages(
    selectors.getDiscrepancies(state),
  ),
  dispositionReason: selectors.getDisposition(state),
  enableGetNext: selectors.enableGetNext(state),
});

const mapDispatchToProps = dispatch => ({
  onAutoSave: operations.onAutoSave(dispatch),
  onClear: operations.onClearDisposition(dispatch),
  onDispositionSaveTrigger: operations.onDispositionSave(dispatch),
  onDispositionSelect: operations.onDispositionSelect(dispatch),
});

const DispositionContainer = connect(mapStateToProps, mapDispatchToProps)(Disposition);

export default DispositionContainer;
