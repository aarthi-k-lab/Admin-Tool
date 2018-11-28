async function run() {
  const sample = require("../tests/readdata.js");
  console.log("in takedate");
  const x = await sample.readExcel();
  console.log('HEY', x);
}

run();