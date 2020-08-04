const { Transform } = require('stream');

module.exports = {
  getLowercaseKeysStream: (keys) => {
    const replacementFn = (str) => str.toLowerCase();
    const regexp = new RegExp(keys.map(replacementFn).join('|'), 'gi');

    return new Transform({
      transform(chunk, encoding, callback) {
        let string = chunk.toString('utf-8');

        string = string.replace(regexp, (match) => {
          return replacementFn(keys.find((el) => el === match));
        });

        return callback(null, string);
      },
    });
  },
};
