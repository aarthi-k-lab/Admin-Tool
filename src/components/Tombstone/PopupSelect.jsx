import React from 'react';
import { RFD, COLLATERAL, REASONABLE_EFFECT } from '../../constants/loanInfoComponents';
import RFDContent from './TombstoneComponents/RFDContent';
import CollateralContent from './TombstoneComponents/CollateralContent';
import ReasonableEffort from './TombstoneComponents/ReasonableEffort';

const tombstonePopupMap = {
  [RFD]: <RFDContent />,
  [COLLATERAL]: <CollateralContent />,
  [REASONABLE_EFFECT]: <ReasonableEffort />,
};

function getTombstonePopup(data) {
  return tombstonePopupMap[data];
}

export default getTombstonePopup;
