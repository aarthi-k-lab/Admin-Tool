
const Excel = require('exceljs');
const fs = require('fs');

module.exports = {
  readExcel: function readExcel() {
    const array = [];
    const workbook = new Excel.Workbook();
    // const sheetnamelist = workbook.SheetNames;
    // fetch sheet by name
    return workbook.xlsx.readFile('lib/CMOD.xlsx').then(() => {
      const worksheet = workbook.getWorksheet('check');
      const row = worksheet.rowCount;
      console.log(`Success ${row}`);
      for (let i = 1; i <= row; i += 1) {
        // console.log(worksheet.getRow(i).getCell(1).value);
        array[i] = worksheet.getRow(i).getCell(1).value;
      }
      return array;
    });
    console.log('askashaks');
  },
};

