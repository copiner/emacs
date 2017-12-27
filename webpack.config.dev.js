const pathLib = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const OpenBrowser = require('open-browser-webpack-plugin');
const ExtractText = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const config = require('./config/config');
module.exports = {
    entry: {
        index: [
            'babel-polyfill',
            'react-hot-loader/patch',
            'webpack-hot-middleware/client?path=http://localhost:8000/__webpack_hmr',
            pathLib.resolve(__dirname,'src', 'index.js')
        ],
        vendor: ['react','react-dom','react-router-dom','redux','react-redux','redux-saga','swipe-js-iso','react-swipe','react-addons-pure-render-mixin']
    },
    output: {
        path: pathLib.resolve(__dirname, 'build'),
        publicPath: "/",
        filename: '[name].[hash:8].js'
    },
    devtool:'eval-source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use:ExtractText.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[path][name]-[local]-[hash:base64:5]',
                                importLoaders: 1
                            }
                        },
                        'postcss-loader'
                    ]
                })
            },
            {
                test:/\.(png|jpg|gif)$/,
                exclude:/node_modules/,
                use:[
                    {
                        loader:'url-loader',
                        options: {
                            limit:8192
                        }
                    }
                    ]
            },
            {
                test: /\.(eot|woff|ttf|woff2|svg)$/,
                use: 'url-loader'
            }
        ]
    },
    plugins: [
        new CleanPlugin(['build']),
        new ProgressBarPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.DefinePlugin({
           "progress.env.NODE_ENV":JSON.stringify('development')
        }),
        new HtmlWebpackPlugin({
            title: "My app",
            showErrors: true,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),//保证出错时页面不阻塞，且会在编译结束后报错
        new ExtractText({
            filename:'bundle.[hash].css',
            disable:false,
            allChunks:true
        }),
        new OpenBrowser({url:`http://${config.hotReloadHost}:${config.hotReloadPort}`}),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest"
        })
    ],
    resolve: {
        extensions: ['.js', '.json', '.sass', '.scss', '.less', 'jsx']
    }
};
