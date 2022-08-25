# tik
A new version of Serendity.

## 构建
环境要求

```
node: 16.16.0 x86
VS2019
minGW
```
**不能使用pnpm包管理，编译存在问题**

分别在根目录以及`frontend`目录下

```bash
yarn 
```

### winax
winax在electron下需要重新构建

> .\node_modules\.bin\electron-rebuild.cmd

### iohook
用于构建符合当前node版本以及electron版本的build.node

* 构建需要有`VS2019` `minGW` 环境
> 1. cd node_modules\iohook
> 2. node build.js --runtime electron --version 13.6.9 --abi 89

## 调试运行

```bash
yarn dev
```

## 编译

```bash
yarn build-w
```
