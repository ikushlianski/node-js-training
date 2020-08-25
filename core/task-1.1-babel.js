import { Transform } from 'stream';

const reverseStream = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, `${chunk.reverse()}\n`);
  },
});

process.stdin.pipe(reverseStream).pipe(process.stdout);
