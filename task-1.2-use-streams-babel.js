import path from 'path';
import { pipeline } from 'stream';
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';

import csvtojson from 'csvtojson';

import { logMemoryUsage } from './utils/logMemoryUsage';

const filePath = path.join(__dirname, 'csv', 'books-big.csv');
const targetFile = path.join(__dirname, 'txt', 'books-stream.txt');
const targetDir = path.dirname(targetFile);

const readStream = createReadStream(filePath);

if (!existsSync(targetDir)) {
  mkdirSync(targetDir);
}

const writeStream = createWriteStream(targetFile);

pipeline(readStream, csvtojson(), writeStream, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Read successfully using streams');
    logMemoryUsage(); // ~30 MB on `books-big.csv`
  }
});
