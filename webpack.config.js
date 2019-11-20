const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    output: {
        path: Path.join(__dirname, './dist'),
        filename: 'main.js'
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: [/\.js(\?.*)?$/i, /\.html(\?.*)?$/i],
                parallel: true,
                cache: true,
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            })
        ],
    },
    resolve: {
        modules: [
            'src',
            'node_modules'
        ],
        extensions: ['*', '.js', '.jsx'],
    },
    module: {
        rules: [
            { test: [/\.(js|jsx)$/], exclude: /node_modules/, loader: 'babel-loader' },
            {
                test: /\.js$/,
                include: Path.resolve(__dirname, 'scripts'),
                loader: 'url-loader?limit=10000&name=scripts/[name].[hash].[ext]'
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&name=fonts/[name].[hash].[ext]'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=[path][name].[hash].[ext]'
            },
            { test: /\.jpe?g$|\.gif$|\.ico$|\.png$/i, loader: 'file-loader?name=[path][name].[hash].[ext]' },
            { test: /\.js$/, include: /vendors/, loader: 'url-loader?limit=10000&name=vendors/[name].[hash].[ext]' },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            }
        ],
    }
};
