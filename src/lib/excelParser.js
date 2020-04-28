import * as XLSX from 'xlsx';
import * as R from 'ramda';

function toJson(workbook) {
  const sheetName = R.head(workbook.SheetNames);
  const result = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    raw: true, defval: null, blankrows: false,
  });
  return JSON.stringify(result, 2, 2);
}

const processWb = async (wb) => {
  const output = toJson(wb);
  return output;
};

const processFile1 = async (file) => {
  const reader = new window.FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async (e) => {
      const excelFile = e.target.result;
      const workbook = XLSX.read(excelFile, {
        type: 'binary',
      });
      const processedData = processWb(workbook).then(data => data);
      if (processedData) {
        resolve(processedData);
      }
      reader.onerror = reject;
    };
    reader.readAsBinaryString(file);
  });
};

const processFile = async file => processFile1(file).then(data => data);

export default processFile;
