// way 1:
// process.stdin.on('data', (data) => {
//   process.stdout.write(data.reverse().toString())
// });

// way 2:
// process.stdin.on('data', (data) => {
//   // console.log is a wrapper around process.stdout
//   console.log(data.reverse().toString())
// });

// way 3:
const { Transform } = require('stream');

const reverseStream = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, `${chunk.reverse()}\n`);
  }
});

process.stdin.pipe(reverseStream).pipe(process.stdout);
