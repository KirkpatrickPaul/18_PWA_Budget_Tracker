const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
  entry: {
    app: './public/assets/js/index.js',
    sw: './public/assets/js/service-worker.js'
  },
  output: {
    path: __dirname + '/public/dist',
    filename: '[name].bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new WebpackPwaManifest({
      fingerprints: false,
      inject: false,
      display: 'standalone',
      name: 'Budget Tracker App',
      short_name: 'Budget',
      description:
        'An application that allows you to track your budget by adding or subtracting money.',
      background_color: '#01579b',
      theme_color: '#317EFB',
      start_url: '/',
      icon: [
        {
          src: path.resolve('public/assets/icons/icon.png'),
          size: [192, 512],
          destination: path.join('assets', 'icons')
        }
      ]
    })
  ]
};

module.exports = config;
