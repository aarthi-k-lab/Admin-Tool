import React from 'react';
import * as PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import './DocumentPopover.css';

function DocumentPopover(props) {
  const { hoverDoc } = props;
  return (
    <div styleName="container">

      <div>
        <Typography styleName="docType">
          {hoverDoc.docTypeCategory}
        </Typography>
      </div>
      <div>
        <Typography styleName="agentName">
          {`by ${hoverDoc.docCreator}`}
        </Typography>
      </div>
    </div>
  );
}

DocumentPopover.propTypes = {
  hoverDoc: PropTypes.shape({
    docCreator: PropTypes.string,
    docTypeCategory: PropTypes.string,
  }).isRequired,
};

export default DocumentPopover;
