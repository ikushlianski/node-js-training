import path from 'path';
import fs from 'fs';

import csvtojson from 'csvtojson';

import { logMemoryUsage } from './utils/logMemoryUsage';

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
      const transformed = Object.fromEntries(
        Object.entries(currentLine).map(([key, value]) => [
          key.toLowerCase(),
          value,
        ]),
      );
      result += `${JSON.stringify(transformed)}\n`;

      return result;
    }, '');

    fs.writeFile(targetFile, lines, { flag: 'w' }, (err) => {
      if (err) {
        console.error(err);
      }

      logMemoryUsage(); // ~50 MB on `books-big.csv`
    });
  });
