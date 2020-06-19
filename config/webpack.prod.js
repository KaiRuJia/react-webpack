const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin'); //压缩JS代码 会开启多个子进程
const MiniCssExtractPlugin = require('mini-css-extract-plugin');// 将css提取到单独的文件中
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //css压缩

module.exports = merge(common,{
  mode: 'production',
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins:[
    new MiniCssExtractPlugin({ //此插件将CSS提取到单独的文件中。它为每个包含CSS的JS文件创建一个CSS文件。它支持CSS和SourceMaps的按需加载
      filename: '[name].css',
    }),
    new ParallelUglifyPlugin({
      uglifyJS: {
        output: {
          beautify: false,//是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果，可以设置为false
          comments: false //是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为false
        },
        warnings: false,
        compress: {
          drop_console: true,//是否删除代码中所有的console语句，默认为不删除，开启后，会删除所有的console语句
        }
      }
    })
  ]
})