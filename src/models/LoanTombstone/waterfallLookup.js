import { NA } from './LoanTombstone';

export default function waterfallLookup(id) {
  switch (id) {
    case 1: return 'Non-GSE/Default Waterfall';
    case 2: return 'FHA Waterfall';
    case 3: return 'VA/USDA Waterfall';
    case 4: return 'DHHL/PHA Waterfall';
    case 5: return 'FNMA Waterfall';
    case 6: return 'FHLMC Waterfall';
    case 7: return 'HFS Waterfall';
    case 8: return 'Special Servicing 1 Waterfall';
    case 9: return 'Special Servicing 2 Waterfall';
    case 10: return 'Non-GSE/Non-Delegated Waterfall';
    case 11: return 'BoNY Waterfall';
    case 12: return 'USAA Waterfall';
    case 13: return 'Disaster Waterfall';
    case 14: return 'State Alternative Review Waterfall';
    case 15: return 'USAA HE Loan / HELOC';
    case 16: return 'Z Deal Waterfall';
    default: return NA;
  }
}
