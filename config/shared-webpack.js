const autoprefixer = require('autoprefixer');

module.exports.PostCssConfig = {
  ident: 'postcss',
  plugins: () => [
    require('postcss-flexbugs-fixes'),
    autoprefixer({
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9', // React doesn't support IE8 anyway
      ],
      flexbox: 'no-2009',
    }),
  ],
};

module.exports.FileLoaderExcludes = [
  /\.html$/,
  /\.(js|jsx)$/,
  /\.css$/,
  /\.json$/,
  /\.bmp$/,
  /\.gif$/,
  /\.jpe?g$/,
  /\.png$/,
  /\.scss$/,
];
