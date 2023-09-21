# Docker Mobile （Docker移动端管理工具）
## 前言
很多人有在移动端管理`docker`的需求，目前市面上常见的开源`docker`管理工具都只针对桌面做了适配，在手机上操作非常不方便，所以才有了开发此项目的想法

## 功能规划
这一个在移动端网页管理`docker`的工具，目前的功能支持及规划如下

- [x] 用户登录、注销、修改密码 **（已支持）**
- [x] 查看容器列表、容器详细配置、容器日志 **（已支持）**
- [x] 容器启动、暂停、恢复、停止、重启、移除等基本操作 **（已支持）**
- [x] 支持PWA模式 **（已支持）**
- [x] 创建容器 **（已支持）**
- [x] 管理镜像 **（已支持）**
- [x] 管理网络 **（已支持）**
- [ ] 管理卷 **（即将支持）**
- [ ] 多环境管理
- [ ] 支持模版创建、管理模版
- [ ] 支持模版市场
- [ ] 支持多语言
  
## 部署方式

### 1、使用 `docker-compose.yml`

到宿主机对应文件目录下使用下面命令创建文件夹及`docker-compose.yml`文件
```
mkdir docker-mobile
cd docker-mobile
touch docker-compose.yml
```
使用`vim`或其他工具修改 `docker-compose.yml`文件如下，配置文件路径请自定义
```yml
version: "3" # 表示该docker-compose.yml文件使用的是Version 3  
services:  # 为project定义服务
  docker-mobile:  # 指定服务名称
    container_name: docker-mobile # 指定容器名
    image: evanfzq/docker-mobile:latest  # 指定服务所使用的镜像
    ports:  # 暴露端口信息
      - 3580:3580
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock  # 与docker宿主通信的 sock 地址
      - /host/file/path:/docker-mobile # 服务配置文件存放的地方
```
在`docker-compose.yml`文件所在文件夹下执行下列命令启动服务
```
docker-compose up -d 
```

### 2、使用`docker run`
使用终端执行下面命令（注意修改host配置文件路径）
```
docker run -name docker-mobile -d -p 3580:3580 -v /var/run/docker.sock:/var/run/docker.sock -v /host/file/path:/docker-mobile evanfzq/docker-mobile:latest
```

## 配置文件
配置文件在容器的`/docker-mobile/config`目录下，文件名为`config.json`

内容如下
```js
{
    "secret": "ae1100e7-6a15-407b-85ac-87862599ba50", // 用户登录信息加密的密钥，服务自行管理，无需修改
    "username": "admin", //登录用户名，可修改
    "password": "1995feng320", //登录密码，可修改
    "passwordMaxRetryNum":10, //密码最大尝试次数，可修改，输入错误次数大于该次数后密码将被重置为随机值，需要后台自行修改密码以便登录（该设置为安全设置，避免暴力破解密码）
    "passwordRetryNum": 0 //密码已尝试次数，服务自行管理，无需修改
}
```
**修改配置前请先停止容器**

# 警告
**该容器拥有宿主机器`docker`的所有权限，请谨慎将容器的端口暴露到外网，暴露到外网使用时请务必使用`https`访问，避免明文传输账户密码被中间人攻击导致的密码泄漏**