const { FileLoaderExcludes, PostCssConfig } = require('./shared-webpack');

module.exports = [
  { test: /\.tsx?$/, loader: 'ts-loader' },
  {
    test: /^(?=.*.scss)(?!.*module).*/,
    loaders: ['style-loader', 'css-loader', 'sass-loader'],
  },
  {
    test: /\.module.scss$/,
    oneOf: [
      {
        test: /module.s?css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              modules: true,
              camelCase: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: PostCssConfig,
          },
          {
            loader: require.resolve('sass-loader'),
          },
        ],
      },
      {
        use: [
          'style-loader',
          'css-loader',
          {
            loader: require.resolve('postcss-loader'),
            options: PostCssConfig,
          },
          'sass-loader',
        ],
      },
    ],
  },
  {
    test: /\.(png|jpg|gif)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          prefix: 'app',
        },
      },
    ],
  },
  {
    test: /\.css$/,
    loader: 'style-loader!css-loader?sourceMap',
  },
  {
    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url-loader?limit=10000&mimetype=application/font-woff',
    options: {
      prefix: 'app',
    },
  },
  {
    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url-loader?limit=10000&mimetype=application/font-woff',
    options: {
      prefix: 'app',
    },
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
    options: {
      prefix: 'app',
    },
  },
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'file-loader',
    options: {
      prefix: 'app',
    },
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
    options: {
      prefix: 'app',
    },
  },
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets: ['es2015', 'react', 'stage-2'],
      },
    },
  },
];
