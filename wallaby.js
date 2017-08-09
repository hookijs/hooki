const babel = require('babel-core');

module.exports = (wallaby) => {
  return {
    files: [
      'src/*.js'
    ],
    tests: [
      'test/*spec.js'
    ],
    preprocessors: {
      '**/*.js': file => babel.transform(file.content, {sourceMap: true, presets: ['es2015'], plugins: ['babel-plugin-add-module-exports']})
    },
    env: {
      type: 'node'
    },
    debug: true
  };
};
