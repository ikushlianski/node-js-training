const path = require('path');
const {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
} = require('fs');
const { pipeline } = require('stream');
const csvtojson = require('csvtojson');
const { logMemoryUsage } = require('./utils/logMemoryUsage');
const {
  getLowercaseKeysStream,
} = require('./utils/getLowerCaseTransformStream');

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
    logMemoryUsage(); // ~6 MB on `books-big.csv`
  }
});
