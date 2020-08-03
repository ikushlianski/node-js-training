const path = require('path');
const fs = require('fs');
const csvtojson = require('csvtojson');
const { logMemoryUsage } = require('./utils/logMemoryUsage');

const sourceFile = path.join(__dirname, 'csv', 'books-big.csv');
const targetFile = path.join(__dirname, 'txt', 'books.txt');
const targetDir = path.dirname(targetFile);

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

csvtojson()
  .fromFile(sourceFile)
  .then((jsonObj) => {
    const lines = jsonObj.reduce((result, currentLine) => {
      result += `${JSON.stringify(currentLine)}\n`;

      return result;
    }, '');

    fs.writeFile(targetFile, lines, { flag: 'w' }, (err) => {
      if (err) {
        console.error(err);
      }

      logMemoryUsage(); // ~29 MB on `books-big.csv`
    });
  });
