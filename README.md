## webpack css_module配置与使用
1. npm i -D style-loader  css-loader less less-loade
2. loader的放置顺序 style-loader， css-loader, less-loader [放在后面的先被解析]
3. css-loader启动css module配置: 好处----代码隔离

---
### css module、react-css-modules、 bable-plugins-react-css-modules

*  css module：在每个样式中都是style.*中的形式比较麻烦
```
  import styles from './styles.css'
  <div className={ styles.theTitle >something</div>
```
* react-css-modules：缺点是是需要运行时的依赖，而且需要在运行时才获取className，性能损耗大。在比较大的项目中，会导致较大的延迟

* bable-plugins-react-css-modules： 把className获取前置到编译阶段。

---

### babel-plugin-react-css-modules 配置和使用

`npm i --save babel-plugin-react-css-modules`

`npm i --save-dev postcss-less`

```js
//babel-plugin-react-css-modules有一个运行时依赖，所以用--save安装比较好
//postcss-less则用于解析LESS的语法

plugins: [
  // ...其它插件
  [
     'react-css-modules',
      {
        'filetypes': {
          '.less': { "syntax": 'postcss-less'}
          },
        generateScopedName: '[local]--[hash:base64:5]'
     }
   ]
 ]
```

```js
//index.js 文件

import './index.less';
<div styleName="major-fontColor">
  <Button onClick={this.handleClick} type="primary">更换</Button>
</div>
<p className="test">测试环境</p>
```

```js
//index.less文件
.major-fontColor {
  background: #fff;
}
:global {
  .test {
    color: red;
  }
}
```