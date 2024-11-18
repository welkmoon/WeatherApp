const path = require('path');

module.exports = {
  mode: 'development',
  entry: './js/script.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.mustache$/,  // Обробка файлів з розширенням .mustache
        use: 'raw-loader'      // Завантаження шаблонів як рядки
      }
    ]
  }
};
