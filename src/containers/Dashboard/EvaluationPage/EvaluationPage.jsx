import React from 'react';
import ContentHeader from 'components/ContentHeader';
import FullHeightColumn from 'components/FullHeightColumn';
import Controls from 'containers/Controls';
import Disposition from 'containers/Dashboard/Disposition';
import TaskPane from 'containers/Dashboard/TaskPane';
import Tombstone from 'containers/Dashboard/Tombstone';
import './EvaluationPage.css';

class EvaluationPage extends React.PureComponent {
  render() {
    return (
      <>
        <ContentHeader title="Document Verification">
          <Controls
            showEndShift
            showGetNext
          />
        </ContentHeader>
        <Tombstone />
        <FullHeightColumn styleName="columns-container">
          <TaskPane />
          <Disposition />
        </FullHeightColumn>
      </>
    );
  }
}

export default EvaluationPage;
