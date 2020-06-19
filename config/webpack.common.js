const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // css 压缩
const dev_ENV = process.env.npm_lifecycle_script.split('--mode=')[1] == 'development'

module.exports = {
  entry:{
    index: path.resolve(__dirname, '../src/index.js'),
  },
  output:{
    path: path.resolve(__dirname, '../build'),
    publicPath: './',// cdn /assets/
    filename: '[name].js' 
  },
  resolve:{
    extensions: ['.js', '.jsx', '.scss', '.json', '.css'],//自动解析确定的扩展,省去你引入组件时写后缀的麻烦
    alias: {//配置一些短路径，
      '@component': path.resolve(__dirname, '../src/component'),
      '@container': path.resolve(__dirname, '../src/container'),
      '@image': path.resolve(__dirname, '../src/image'),
      '@styles': path.resolve(__dirname, '../src/styles'),
      '@utils': path.resolve(__dirname, '../src/utils'),
    },
    modules: [path.resolve(__dirname, "../src"), "node_modules"]
  },
  module:{
    rules:[
      { // babel
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader?cacheDirectory=true',
            options: {
              presets: [
                  '@babel/preset-env',
                  '@babel/preset-react'
              ],
              plugins: [
                '@babel/plugin-transform-runtime', 
                '@babel/plugin-syntax-dynamic-import',
                [ 'react-css-modules', {
                  'filetypes': {
                    '.less': {
                        "syntax": 'postcss-less'
                    }
                  },
                  "generateScopedName": "[local]--[hash:base64:5]"
                }],
                ['@babel/plugin-proposal-decorators', { 'legacy': true} ],
                ['@babel/plugin-proposal-class-properties', { 'loose': true} ],
                ['@babel/plugin-proposal-object-rest-spread', { 'loose': true, 'useBuiltIns': true }],
              ]
            },
          },
        ]
      },
      { // eslist
        test: /\.js$/,
        enforce: 'pre', // 在webpack编译之前进行检测
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader',
            options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
              formatter: require('eslint-friendly-formatter'), // 指定错误报告的格式规范
              emitWarning: true,
              fix: true //启用 ESLint自动修复功能
            }
          }
        ]
      },
      { // css
        test: /\.css$/,
        use: [
          { loader: dev_ENV ? 'style-loader' : MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              modules: false
            }
          }
        ]
      },
      { // sass
        test: /\.scss$/,
        use: [
          { loader: dev_ENV ? 'style-loader' : MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
              },
            }
          },
          {
            loader: 'postcss-loader',
            options: {
                plugins: () => [
                    require('autoprefixer')
                ],
                sourceMap: true
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      { // less
        test: /\.less$/,
        include: path.resolve(__dirname, '../src'),
        use: [
          { loader: dev_ENV ? 'style-loader' : MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader', //  负责读取css文件 放在后面的先被解析
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
              },
            }
          },
          {
            loader: 'postcss-loader',
            options: {
                plugins: () => [
                    require('autoprefixer')
                ],
                sourceMap: true
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      { // html
        test: /\.html$/,
        exclude: /node_modules/,
        use: [{
          loader: 'html-loader',
          options: { 
            minimize: true 
          }
        }]
      },
      { // image
        test: /\.(png|jpg|gif)$/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 10000,//以字节为单位，小于该大小的图片编译成base64
                name:'static/images/[name].[ext]',
            }
        }]
      },
      { // font
        test: /\.(woff|woff2|svg|ttf|eot)$/,
        use:[
          {
            loader: 'file-loader',
            options: {
              name: 'static/fonts/[name].[ext]'
            }
          }
       ]
      }
    ]
  },
  optimization: { //优化
    minimize: true,//true/false,告诉webpack是否开启代码最小化压缩，
    removeEmptyChunks: true,//bool 值，它检测并删除空的块。将设置为false将禁用此优化，
    splitChunks: {
      cacheGroups: { //自定义配置决定生成的文件,缓存策略
        vendor: { // 项目基本框架等
          name: 'vendor',  // 打包后的文件名，任意命名
          chunks: 'all', // 代码块类型 必须三选一： "initial"（初始化） | "all"(默认就是all) | "async"（动态加载） 
          test: /node_modules/, // 正则规则验证，如果符合就提取 chunk
          priority: 1, // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          enforce: true
        },
        commons: { // 其他同步加载公共包
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
          priority: 2,
        }
      }
    }
  },
  plugins:[
    new CleanWebpackPlugin()// 删除文件 保留新文件
  ]
}