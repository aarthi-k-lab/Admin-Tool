/* eslint-disable no-unused-vars */
import React from 'react';
import * as R from 'ramda';
import Validators from 'lib/Validators';
import * as Api from 'lib/Api';


export const NA = '-';
export const defaultVal = 0;

const { getOr } = Validators;

function generateBorrIncomeItem(title, grossAmount, netAmount, description) {
  return {
    title,
    grossAmount,
    netAmount,
    description,
  };
}
function generateBorrExpenseItem(title, grossAmount, description) {
  return {
    title,
    grossAmount,
    description,
  };
}

function get1stOr2ndMortgage(data) {
  const firstOr2ndMortgage = getOr('nstr1stMortgage', data, getOr('secondMortgage', data, defaultVal));
  return generateBorrExpenseItem('1st/2nd Mortgage', firstOr2ndMortgage, NA);
}

function getOtherMortgage(data) {
  const otherMortgage = getOr('otherMortgage', data, defaultVal);
  return generateBorrExpenseItem('Other Mortgage', otherMortgage, NA);
}

function getHomeOwnerAssociation(data) {
  const homeOwnersAssociation = getOr('homeOwnersAssociation', data, defaultVal);
  return generateBorrExpenseItem('Home Owner Association', homeOwnersAssociation, NA);
}

function getAutoLoan1(data) {
  const carPayment1 = getOr('carPayment1', data, defaultVal);
  return generateBorrExpenseItem('Auto Loan#1', carPayment1, NA);
}

function getAutoLoan2(data) {
  const carPayment2 = getOr('carPayment2', data, defaultVal);
  return generateBorrExpenseItem('Auto Loan#2', carPayment2, NA);
}

function getChargeCards(data) {
  const chargeAccount1 = getOr('chargeAccount1', data, 0);
  const chargeAccount2 = getOr('chargeAccount2', data, 0);
  const chargeAccount3 = getOr('chargeAccount3', data, 0);
  const total = chargeAccount1 + chargeAccount2 + chargeAccount3;
  return generateBorrExpenseItem('Charge Cards', total, NA);
}

function getTransportation(data) {
  const gas = getOr('gas', data, 0);
  const publicTrans = getOr('publicTrans', data, 0);
  const total = gas + publicTrans;
  return generateBorrExpenseItem('Transportation (gas,bus,etc..)', total, NA);
}

function getCarInsurance(data) {
  const autoInsurance = getOr('autoInsurance', data, defaultVal);
  return generateBorrExpenseItem('Car Insurance', autoInsurance, NA);
}

function getFamilMedical(data) {
  const medicalBills = getOr('medicalBills', data, 0);
  const healthInsurance = getOr('healthInsurance', data, 0);
  const total = medicalBills + healthInsurance;
  return generateBorrExpenseItem('Family Medical', total, NA);
}

function getFood(data) {
  const food = getOr('food', data, defaultVal);
  return generateBorrExpenseItem('Food', food, NA);
}

function getUtilites(data) {
  const utilites = getOr('utilities', data, defaultVal);
  return generateBorrExpenseItem('Utilites', utilites, NA);
}

function getEducational(data) {
  const studentLoan = getOr('studentLoan', data, 0);
  const schoolTuition = getOr('schoolTuition', data, 0);
  const total = studentLoan + schoolTuition;
  return generateBorrExpenseItem('Eductional', total, NA);
}

function getCell(data) {
  const cellPhone = getOr('cellPhone', data, defaultVal);
  return generateBorrExpenseItem('Cell', cellPhone, NA);
}

function getCable(data) {
  const cableTV = getOr('cableTV', data, defaultVal);
  return generateBorrExpenseItem('Cable', cableTV, NA);
}

function getPhoneBill(data) {
  const phoneBill = getOr('homePhone', data, defaultVal);
  return generateBorrExpenseItem('Phone Bill', phoneBill, NA);
}

function getOtherExpenses(data) {
  const otherExpenses = getOr('otherExpenses', data, defaultVal);
  return generateBorrExpenseItem('Other', otherExpenses, NA);
}

function getChildCare(data) {
  const childCare = getOr('childCare', data, defaultVal);
  return generateBorrExpenseItem('Child Care', childCare, NA);
}

function getRentalLoss(data) {
  const netRentalLoss = getOr('netRentalLoss', data, defaultVal);
  return generateBorrExpenseItem('Rental Loss', netRentalLoss, NA);
}

function getTotalExpenses(data) {
  const totalMonthlyDebt = getOr('totalMonthlyDebt', data, defaultVal);
  return generateBorrExpenseItem('Total', totalMonthlyDebt, NA);
}

function getBorrowerType(data) {
  return getOr('borrowerIncomeType', data, NA);
}

function getGrossIncome(data) {
  return getOr('borrowerGrossIncome', data, NA);
}

function getWages(data) {
  const borrowerType = getBorrowerType(data);
  let val = 0;
  if (borrowerType === 'Salary') {
    val = getGrossIncome(data);
  }
  return generateBorrIncomeItem('Wages', val, NA, NA);
}

function getUnemployment(data) {
  const borrowerType = getBorrowerType(data);
  let val = 0;
  if (borrowerType === 'Unemployment') {
    val = getGrossIncome(data);
  }
  return generateBorrIncomeItem('Unemployment Income', val, NA, NA);
}

function getSelfEmployed(data) {
  const borrowerType = getBorrowerType(data);
  let val = 0;
  if (borrowerType === 'Self Employed') {
    val = getGrossIncome(data);
  }
  return generateBorrIncomeItem('Self Employed', val, NA, NA);
}

function getChildSupport(data) {
  const borrowerAlimonyChildSupport = getOr('borrowerAlimonyChildSupport', data, defaultVal);
  return generateBorrIncomeItem('Child Support/Alimony', borrowerAlimonyChildSupport, NA, NA);
}

function getRentalIncome(data) {
  const borrowerRentalIncome = getOr('borrowerRentalIncome', data, defaultVal);
  return generateBorrIncomeItem('Rent Received', borrowerRentalIncome, NA, NA);
}

function getSSN(data) {
  const ssn = getOr('ssn', data, NA);
  return generateBorrIncomeItem('ssn', ssn, NA, NA);
}

function getRetirement(data) {
  const retirement = getOr('retirement', data, NA);
  return generateBorrIncomeItem('Retirement', retirement, NA, NA);
}

function getDisability(data) {
  const disability = getOr('disability', data, NA);
  return generateBorrIncomeItem('Disability', disability, NA, NA);
}


function getOtherIncome(data) {
  const otherIncome = getOr('otherIncome', data, NA);
  return generateBorrIncomeItem('Other', otherIncome, NA, NA);
}

function getTotal(data) {
  const totalGrossIncome = getOr('totalGrossIncome', data, defaultVal);
  return generateBorrIncomeItem('Total', totalGrossIncome, NA, NA);
}

function getBorrower1GrossIncome(data) {
  const borrower1GrossIncome = getOr('borrower1GrossIncome', data, NA);
//   return generateWestWingItem('Borrower 1 Gross income', borrower1GrossIncome);
}

function fetchBorrIncomeExpense(data) {
  const incomeDataGenerator = [
    getWages,
    getSelfEmployed,
    getUnemployment,
    getChildSupport,
    getRentalIncome,
    getSSN,
    getRetirement,
    getDisability,
    getOtherIncome,
    getTotal,
  ];
  const expenseDataGenerator = [
    get1stOr2ndMortgage,
    getOtherMortgage,
    getHomeOwnerAssociation,
    getAutoLoan1,
    getAutoLoan2,
    getChargeCards,
    getTransportation,
    getCarInsurance,
    getFamilMedical,
    getFood,
    getUtilites,
    getEducational,
    getCell,
    getCable,
    getPhoneBill,
    getOtherExpenses,
    getChildCare,
    getRentalLoss,
    getTotalExpenses,
  ];
  const res = {};
  res.incomeData = incomeDataGenerator.map(fn => fn(data));
  res.expenseData = expenseDataGenerator.map(fn => fn(data));
  return res;
}

const BorrIncomeExpense = {
  fetchBorrIncomeExpense,
};


export default BorrIncomeExpense;
