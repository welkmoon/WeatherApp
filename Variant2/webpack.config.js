const path = require('path');

module.exports = {
  mode: 'development',
  entry: './js/script.js', 
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  }
};