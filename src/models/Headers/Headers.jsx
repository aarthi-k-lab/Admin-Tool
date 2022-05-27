import ResultStatus from 'components/ResultStatus';
import React from 'react';

function getFhlmcColumns(status, selectedRequestType) {
  if (status === 'submitCases') {
    return [
      {
        Header: 'Case ID',
        accessor: 'resolutionId',
        minWidth: 50,
        maxWidth: 100,
        style: { width: '10%' },
        headerStyle: { textAlign: 'left' },
      },
      {
        Header: 'Eval ID',
        accessor: 'evalId',
        minWidth: 50,
        maxWidth: 100,
        style: { width: '10%' },
        headerStyle: { textAlign: 'left' },
      },
      {
        Header: 'Loan Number',
        accessor: 'servicerLoanIdentifier',
        minWidth: 50,
        id: 'servicerLoanIdentifier',
        maxWidth: 100,
        style: { width: '10%' },
        headerStyle: { textAlign: 'left' },
      },
      {
        Header: 'RequestType',
        accessor: 'RequestType',
        minWidth: 50,
        maxWidth: 100,
        style: { width: '80%' },
        headerStyle: { textAlign: 'left' },
        Cell: row => (
          <span>
            {row.value || selectedRequestType}
          </span>
        ),
      },
      {
        Header: 'Result',
        accessor: 'isValid',
        minWidth: 100,
        maxWidth: 400,
        style: { width: '15%' },
        headerStyle: { textAlign: 'left' },
        Cell: props => <ResultStatus cellProps={props} />,
      },
    ];
  } if (status === 'submitPreapprovalLoans') {
    return [
      {
        Header: 'Loan Number',
        accessor: 'servicerLoanIdentifier',
        minWidth: 50,
        id: 'servicerLoanIdentifier',
        maxWidth: 100,
        style: { width: '10%' },
        headerStyle: { textAlign: 'left' },
      },
      {
        Header: 'Disaster Id',
        accessor: 'disasterId',
        minWidth: 50,
        maxWidth: 100,
        style: { width: '10%' },
        headerStyle: { textAlign: 'left' },
      },
      {
        Header: 'RequestType',
        accessor: 'RequestType',
        minWidth: 50,
        maxWidth: 100,
        style: { width: '80%' },
        headerStyle: { textAlign: 'left' },
        Cell: row => (
          <span>
            {row.value || selectedRequestType}
          </span>
        ),
      },
      {
        Header: 'Result',
        accessor: 'isValid',
        minWidth: 100,
        maxWidth: 400,
        style: { width: '15%' },
        headerStyle: { textAlign: 'left' },
        Cell: props => <ResultStatus cellProps={props} />,
      },
    ];
  }
  if (status === 'incorrectData') {
    return [
      {
        Header: 'Case ID',
        accessor: 'resolutionId',
        minWidth: 50,
        maxWidth: 100,
        style: { width: '10%' },
        headerStyle: { textAlign: 'left' },
      },
      {
        Header: 'Loan Number',
        accessor: 'servicerLoanIdentifier',
        minWidth: 50,
        id: 'servicerLoanIdentifier',
        maxWidth: 100,
        style: { width: '10%' },
        headerStyle: { textAlign: 'left' },
      },
      {
        Header: 'Result',
        accessor: 'isValid',
        minWidth: 100,
        maxWidth: 400,
        style: { width: '15%' },
        headerStyle: { textAlign: 'left' },
        Cell: props => <ResultStatus cellProps={props} />,
      },
    ];
  }
  return [
    {
      Header: 'Case ID',
      accessor: 'resolutionId',
      id: 'resolutionId',
      minWidth: 50,
      maxWidth: 100,
      style: { width: '10%' },
      headerStyle: { textAlign: 'left' },
    },
    {
      Header: 'Eval ID',
      accessor: 'evalId',
      id: 'evalId',
      minWidth: 50,
      maxWidth: 100,
      style: { width: '10%' },
      headerStyle: { textAlign: 'left' },
    },
    {
      Header: 'Loan Number',
      accessor: 'loanNumber',
      minWidth: 50,
      id: 'loanNumber',
      maxWidth: 100,
      style: { width: '10%' },
      headerStyle: { textAlign: 'left' },
    },
    {
      Header: 'RequestType',
      accessor: 'RequestType',
      minWidth: 50,
      maxWidth: 100,
      style: { width: '80%' },
      headerStyle: { textAlign: 'left' },
    },
    {
      Header: 'Result',
      accessor: 'isValid',
      minWidth: 50,
      maxWidth: 100,
      style: { width: '15%' },
      headerStyle: { textAlign: 'left' },
      Cell: props => <ResultStatus cellProps={props} />,
    },
    {
      Header: 'Status',
      accessor: 'status',
      minWidth: 50,
      maxWidth: 100,
      style: { width: '15%' },
      headerStyle: { textAlign: 'left' },
    },
    {
      Header: 'Message',
      accessor: 'message',
      minWidth: 100,
      maxWidth: 400,
      style: { width: '15%' },
      headerStyle: { textAlign: 'left' },
    },
  ];
}

function getFHLMCModHistoryColumns() {
  return [
    {
      Header: 'Request Type',
      accessor: 'reqTypeText',
      minWidth: 50,
      maxWidth: 140,
      style: { width: '10%' },
      headerStyle: { textAlign: 'left' },
    },
    {
      Header: 'Resolution Id',
      accessor: 'caseId',
      minWidth: 50,
      maxWidth: 70,
      style: { width: '10%' },
      headerStyle: { textAlign: 'left' },
    },
    {
      Header: 'Date Requested',
      accessor: 'requestDateTime',
      minWidth: 50,
      maxWidth: 100,
      style: { width: '10%' },
      headerStyle: { textAlign: 'left' },
    }, {
      Header: 'Result',
      accessor: 'requestStatus',
      minWidth: 50,
      maxWidth: 100,
      style: { width: '10%' },
      headerStyle: { textAlign: 'left' },
    },
    {
      Header: 'Message',
      accessor: 'requestStatusMessage',
      minWidth: 50,
      maxWidth: 1000,
      style: { width: '10%', 'white-space': 'unset' },
      headerStyle: { textAlign: 'left' },
    },
    {
      Header: 'Modification History',
      accessor: 'modHistory',
      minWidth: 50,
      maxWidth: 1000,
      style: { width: '10%', 'white-space': 'unset' },
      headerStyle: { textAlign: 'left' },
    },
  ];
}

const getters = {
  getFhlmcColumns,
  getFHLMCModHistoryColumns,
};

export default getters;
