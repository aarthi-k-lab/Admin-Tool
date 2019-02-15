import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';
import CardCreator from './CardCreator';
import getStatus from './statusList';
import { selectors } from '../../../state/ducks/dashboard';
import './BackEndDisposition.css';

const shouldExpand = (isExpanded, item, id) => {
  if (isExpanded) return item.id === id;
  return (item.id === id ? false : item.expanded);
};

class BackEndDisposition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: getStatus(),
      operate: 'ExpandAll',
      selectedStatus: {
        Name: '',
        isExpanded: false,
      },
      selectedActivity: '',
      disableSubmit: true,
    };
  }

  setSelectionLabel(id, cardStatus, activityName) {
    this.setState({
      selectedStatus: cardStatus,
      selectedActivity: activityName,
      disableSubmit: false,
    });
    const { status } = this.state;
    const changedStatus = status.map((item) => {
      const tempStatus = {
        ...item,
        labelDisplay: (item.id !== id) ? 'none' : 'block',
      };
      return tempStatus;
    });
    this.setState({ status: changedStatus });
  }

  collapseOthers(id, cardStatus, activityName) {
    this.setState({ selectedStatus: cardStatus, selectedActivity: activityName });
    const { status } = this.state;
    let changedStatus = null;

    changedStatus = status.map((item) => {
      const tempStatus = {
        ...item,
        expanded: shouldExpand(cardStatus.isExpanded, item, id),
      };
      return tempStatus;
    });
    this.setState({ status: changedStatus, operate: 'ExpandAll' });
  }

  handleExpandAll() {
    const {
      operate, status,
    } = this.state;

    const { selectedDisposition } = this.props;
    if (selectedDisposition) {
      const { cardStatus } = selectedDisposition;
      this.setState({ selectedStatus: cardStatus });
    }
    const statuses = status.map(m => ({
      ...m,
      expanded: operate === 'ExpandAll',
    }));
    const changeOperate = operate === 'ExpandAll' ? 'CollapseAll' : 'ExpandAll';
    this.setState({ status: statuses, operate: changeOperate });
  }


  render() {
    const {
      status, operate, selectedStatus, selectedActivity, disableSubmit,
    } = this.state;
    const { selectedDisposition, inProgress } = this.props;
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
    }
    const sameDispositionNotSelected = selectedDisposition
    && (selectedDisposition.cardStatus !== selectedStatus
    || selectedDisposition.activityName !== selectedActivity);
    if (sameDispositionNotSelected) {
      const {
        id,
        cardStatus,
        isActivitySelected,
        activityName,
      } = selectedDisposition;
      if (isActivitySelected) {
        this.setSelectionLabel(id, cardStatus, activityName);
      } else {
        this.collapseOthers(id, cardStatus, activityName);
      }
    }

    return (
      <div styleName="scrollable-block">
        <p styleName="para-title">
            Select the outcome of your review
        </p>
        <button
          onClick={() => this.handleExpandAll()}
          styleName="OperateButton"
          type="submit"
        >
          {operate}
        </button>
        <section styleName="disposition-section">
          { status.map(m => (
            <CardCreator selectedActivity={selectedActivity} status={m} />
          ))}
          <div styleName="CardBottomStyle" />
          <br />
          <div styleName="saveArea">
            <Button
              className="material-ui-button"
              color="primary"
              disabled={disableSubmit}
              styleName="save"
              variant="contained"
            >
              SAVE
            </Button>
          </div>
        </section>
      </div>
    );
  }
}

BackEndDisposition.defaultProps = {
  inProgress: false,
  selectedDisposition: {
    disableSubmit: true,
    cardStatus: {
      Name: '',
      isExpanded: false,
    },
  },
};

BackEndDisposition.propTypes = {
  inProgress: PropTypes.bool,
  selectedDisposition: PropTypes.shape({
    activityName: PropTypes.string,
    cardStatus: PropTypes.shape({
      isExpanded: PropTypes.bool,
      Name: PropTypes.string,
    }),
    disableSubmit: PropTypes.bool,
    id: PropTypes.string,
    isActivitySelected: PropTypes.bool,
    isExpanded: PropTypes.bool,
  }),
};

const mapStateToProps = state => ({
  selectedDisposition: selectors.selectedDisposition(state),
});

const BackendDisposition = connect(mapStateToProps, null)(BackEndDisposition);

const TestHooks = {
  BackEndDisposition,
};

export default BackendDisposition;

export {
  TestHooks,
};
