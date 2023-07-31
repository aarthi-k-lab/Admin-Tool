import React from 'react';
import {
  RFD, COLLATERAL, REASONABLE_EFFECT, HARDHSIP,
} from '../../constants/loanInfoComponents';
import RFDContent from './TombstoneComponents/RFDContent';
import CollateralContent from './TombstoneComponents/CollateralContent';
import ReasonableEffort from './TombstoneComponents/ReasonableEffort';
import HardshipAffidavit from './TombstoneComponents/HardshipAffidavit/HardshipAffidavit';

const tombstonePopupMap = {
  [RFD]: <RFDContent />,
  [COLLATERAL]: <CollateralContent />,
  [REASONABLE_EFFECT]: <ReasonableEffort />,
  [HARDHSIP]: <HardshipAffidavit />,
};

function getTombstonePopup(data) {
  return tombstonePopupMap[data];
}

export default getTombstonePopup;
