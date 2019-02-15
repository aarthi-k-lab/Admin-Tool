import React from 'react';
import ContentHeader from 'components/ContentHeader';
import FullHeightColumn from 'components/FullHeightColumn';
import Controls from 'containers/Controls';
import FrontEndDisposition from 'containers/Dashboard/FrontEndDisposition';
import { BackendDisposition } from 'containers/Dashboard/BackEndDisposition';
import TaskPane from 'containers/Dashboard/TaskPane';
import Tombstone from 'containers/Dashboard/Tombstone';
import './EvaluationPage.css';
import PropTypes from 'prop-types';

class EvaluationPage extends React.PureComponent {
  render() {
    const { group } = this.props;
    return (
      <>
        <ContentHeader title="Income Calculation">
          <Controls
            showEndShift
            showGetNext
          />
        </ContentHeader>
        <Tombstone />
        <FullHeightColumn styleName="columns-container">
          <TaskPane />
          {group === 'BEUW' ? <BackendDisposition /> : <FrontEndDisposition /> }
        </FullHeightColumn>
      </>
    );
  }
}

EvaluationPage.defaultProps = {
  group: 'FEUW',
};

EvaluationPage.propTypes = {
  group: PropTypes.string,
};

export default EvaluationPage;
