# 踩坑记录

## antd 自定义样式 需要的包的版本

```js
    "antd": "^3.17.0",
    "babel-plugin-import": "^1.13.5",
    "customize-cra": "^1.0.0",
    "less": "^3.13.1",
    "less-loader": "^6.2.0",
    "react": "^16.12.0",
    "react-app-rewired": "^2.2.1",
```

## 高阶函数

1. 接收函数类型的参数
2. 返回值是函数

> 定时器, Promise, 数组遍历相关的函数 map forEach find findIndex reduce 
> fn.bind() 
> 高阶组件本质


## 分页列表

1. 前台分页
  一次获取所有的数据，在翻页的时候不需要发送请求
  请求接口无需分页，分页参数无需指定
2. 后台分页
   在获取数据的时候按照接口要求传入分页的参数，每次都获取当前页的数据，
