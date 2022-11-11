# HTTP PROXY SERVER

> 这是一个简单的golang项目，主要作用是用于创建一个http服务，他会将请求转发给league client server，并将结果返回。

## 使用
```shell
proxy.exe -h https://127.0.0.1:13998 -p 8999 -a "Basic cmlvdDotQXA4QmpwdHp5SzZUSUF1Q3ZqOXRn"
```

## 编译执行
1. 安装依赖，主要用于修改编译后的二进制可执行文件的属性，进行白名单伪装
```shell
go install github.com/josephspurrier/goversioninfo/cmd/goversioninfo@latest

```

2. 执行生成
```shell
go generate
```

3. 编译
```shell
go build
```