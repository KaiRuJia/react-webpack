const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common,{
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        publicPath: '/',
        watchOptions:{ 
            aggregateTimeout: 300, // 防抖 一旦第一个文件改变，在重建之前添加一个延迟。填以毫秒为单位的数字
            poll: 1000, // 每秒 1000次  每隔（你设定的）多少时间查一下有没有文件改动过。不想启用也可以填false。
            ignored: /node_modules/ // 不需要监控的文件夹 观察许多文件系统会导致大量的CPU或内存使用量。可以排除一个巨大的文件夹
        },
        host: '0.0.0.0',
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true,
        proxy:{
            '/common/**/*.json': {
                target: 'https://mock.yonyoucloud.com/mock/10603/',
                changeOrigin: true,
                secure: true
            }
        }
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: path.resolve('src', 'index.html'),
            filename: 'index.html',
        }),
        new webpack.HotModuleReplacementPlugin() //用以在运行时更新发生改变的模块，从而无需进行完全刷新
    ],
})