import path from 'path';
import { pipeline } from 'stream';
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import { getLowercaseKeysStream } from './utils/getLowerCaseTransformStream';
import csvtojson from 'csvtojson';

import { logMemoryUsage } from './utils/logMemoryUsage-babel';

const filePath = path.join(__dirname, 'csv', 'books-original.csv');
const targetFile = path.join(__dirname, 'txt', 'books-stream.txt');
const targetDir = path.dirname(targetFile);

const readStream = createReadStream(filePath);

if (!existsSync(targetDir)) {
  mkdirSync(targetDir);
}

const writeStream = createWriteStream(targetFile);

const transformStream = getLowercaseKeysStream([
  'Author',
  'Book',
  'Amount',
  'Price',
]);

pipeline(readStream, csvtojson(), transformStream, writeStream, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Read successfully using streams');
    logMemoryUsage(); // ~30 MB on `books-big.csv`
  }
});
