const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    popup: path.resolve(__dirname, 'src/popup/popup.tsx'),
    options: path.resolve(__dirname, 'src/options/options.tsx'),
    background: path.resolve(__dirname, 'src/background/background.ts'),
    contentScript: path.resolve(__dirname, 'src/contentScript/contentScript.ts')
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.tsx?$/,
        exclude: /node_modules/
      },
      {
        use: ['style-loader', 'css-loader', {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [tailwindcss, autoprefixer]
            }
          }
        }],
        test: /\.css$/i
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/assets/tailwind.css'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'src/static'), to: path.resolve(__dirname, 'dist') },
      ]
    }),
     new HtmlPlugin({
            // template: './src/popup/popup.html', // Path to your popup.html template
            title: "Annotate",
            filename: 'popup.html', // Output filename for popup.html
            chunks: ['popup'], // Add chunks if needed
        }),
        new HtmlPlugin({
            // template: './src/options/options.html', // Path to your options.html template
            title: "Options",
            filename: 'options.html', // Output filename for options.html
            chunks: ['options'], // Add chunks if needed
        }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
