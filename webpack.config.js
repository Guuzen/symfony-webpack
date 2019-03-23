const isProd = process.env.NODE_ENV === 'production';

const path = require('path');
const glob = require('glob');
const url = require('url');
const autoprefixer = require('autoprefixer');
const imageminMozjpeg = require('imagemin-mozjpeg');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const HtmlPlugin = require('html-webpack-plugin');
const WebappPlugin = require('webapp-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const useSourcemaps = !isProd;
const useDevServer = !isProd;
const useVersioning = isProd;
const useMinification = isProd;
const disableImagesProcessing = true;
const assetsSrcFolder = path.resolve(__dirname, 'assets');
const assetsPublicPath = '/assets/';
const publicPath = (() => {
    if (useDevServer) {
        require('dotenv').config();
        return process.env.ASSETS_BASE_URL + assetsPublicPath;
    } else {
        return assetsPublicPath;
    }
})();

const webpackConfig = {
    mode: process.env.NODE_ENV,
    devtool: useSourcemaps ? 'inline-source-map' : false,
    entry: {
        module1: path.resolve(assetsSrcFolder, 'module1', 'main.js'),
        module2: path.resolve(assetsSrcFolder, 'module2', 'main.js'),
        admin: path.resolve(assetsSrcFolder, 'admin', 'main.js'),
    },
    output: {
        filename: '[name]' + (useVersioning ? '-[contenthash:8]' : '') + '.js',
        path: path.resolve(__dirname, 'public', 'assets'),
        publicPath: publicPath,
    },
    optimization: {
        minimize: useMinification,
        splitChunks: {
            cacheGroups: {
                'vendors': {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
        runtimeChunk: 'single',
    },
    devServer: {
        host: url.parse(publicPath).hostname,
        port: url.parse(publicPath).port,
        contentBase:
            glob.sync('templates/**/')
        ,
        watchContentBase: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    {
                        loader: 'css-hot-loader',
                    },
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            sourceMap: useSourcemaps,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: useSourcemaps,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer(),
                            ],
                        },
                    },
                    {
                        loader: 'resolve-url-loader',
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sourceMapContents: false,
                        },
                    },
                ],
            },
            {
                test: /\.css/i,
                loader: 'css-loader',
            },
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name]' + (useVersioning ? '-[contenthash:8]' : '') + '.[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name]' + (useVersioning ? '-[contenthash:8]' : '') + '.[ext]',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CopyPlugin([
            {
                from: path.resolve(assetsSrcFolder, 'static'),
                to: 'static/[path][name]' + (useVersioning ? '-[hash:8]' : '') + '.[ext]',
            },
        ]),
        new MiniCssExtractPlugin({
            filename: 'css/[name]' + (useVersioning ? '-[contenthash:8]' : '') + '.css',
        }),
        new ManifestPlugin({
            writeToFileEmit: true,
            basePath: 'assets/',
            filter: (file) => {
                if (path.extname(file.name) === '.twig') {
                    return false;
                }
                return file.name.indexOf('assets/favicons') !== 0;
            },
            map: (file) => {
                if (useVersioning) {
                    file.name = file.name.replace(/(-[a-f0-9]{8})(\..*)$/, '$2');
                }
                return file;
            },
        }),
        new CleanPlugin(),
        new ImageminPlugin({
            disable: disableImagesProcessing,
            test: /\.(jpg|jpeg|png|gif)$/i,
            plugins: [
                imageminMozjpeg({
                    quality: 85,
                }),
            ],
        }),
        new HtmlPlugin({
            filename: path.resolve(__dirname, 'templates', 'favicons.html.twig'),
            templateContent: '',
            inject: false,
        }),
        new WebappPlugin({
            logo: './assets/favicon.png',
            prefix: 'favicons' + (useVersioning ? '-[contenthash:8]' : ''),
            inject: 'force',
        }),
        new WriteFilePlugin({
            test: /\.twig$/i,
        }),
    ],
};

if (useMinification) {
    webpackConfig.optimization.minimizer = [
        new TerserPlugin(),
        new OptimizeCssAssetsPlugin(),
    ];
}

module.exports = webpackConfig;
