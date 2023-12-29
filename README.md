# iDocker（Docker移动端管理工具）
## 前言
很多人有在移动端管理`docker`的需求，目前市面上常见的开源`docker`管理工具都只针对桌面做了适配，在手机上操作非常不方便，所以才有了此项目

## 功能规划
这一个在移动端网页管理`docker`的工具，目前的功能支持及规划如下

### 已支持功能：
| 功能             | 移动端             | PC端     |
| ---------------- | ------------------ | -------- |
| 用户管理         | &#10004;           | &#10004; |
| 容器管理         | &#10004;           | &#10004; |
| 容器版本更新     | &#10004;           | &#10004; |
| 容器终端         | &#10008;           | &#10004; |
| 导航页           | &#10004;           | &#10004; |
| 管理镜像         | &#10004;           | &#10004; |
| 管理网络         | &#10004;           | &#10004; |
| 管理数据卷       | &#10004;           | &#10004; |
| PWA              | &#10004;           | &#10004; |
| 事件通知         | &#10004;           | &#10004; |
| 支持自定义镜像源 | 仅选用，未支持管理 | &#10004; |

### 规划中的功能
| 近期规划             | 中期规划   | 长期规划       |
| -------------------- | ---------- | -------------- |
| 终端支持自定义CMD    | 支持多语言 | 导航页功能更新 |
| 移动端支持管理镜像源 | UI美化     | 应用市场       |
| 路径提示             |            | 多环境管理     |
  
## 部署方式

### 1、使用 `docker-compose.yml`

到宿主机对应文件目录下使用下面命令创建文件夹及`docker-compose.yml`文件
```
mkdir idocker
cd idocker
touch docker-compose.yml
```
使用`vim`或其他工具修改 `docker-compose.yml`文件如下，配置文件路径请自定义
```yml
version: "3" # 表示该docker-compose.yml文件使用的是Version 3  
services:  # 为project定义服务
  idocker:  # 指定服务名称
    container_name: idocker # 指定容器名
    image: evanfzq/idocker:latest  # 指定服务所使用的镜像
    ports:  # 暴露端口信息
      - 3580:3580
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock  # 与docker宿主通信的 sock 地址
      - /host/file/path:/idocker # 服务配置文件存放的地方
```
在`docker-compose.yml`文件所在文件夹下执行下列命令启动服务
```
docker-compose up -d 
```

### 2、使用`docker run`
使用终端执行下面命令（注意修改host配置文件路径）
```
docker run -name idocker -d -p 3580:3580 -v /var/run/docker.sock:/var/run/docker.sock -v /host/file/path:/idocker evanfzq/idocker:latest
```

## 配置文件
配置文件在容器的`/idocker/config`目录下，一般情况下系统配置用户无需改动，由程序自行管理
### 用户配置
文件名为`userConfig.yml`

### 系统配置
文件名为`systemConfig.yml`

### 重置密码
针对忘记密码的情况，可通过下面步骤进行重置

- 停止服务
- 删除系统配置`systemConfig.yml`的`passwordHash`字段
- 启动服务，通过查看docker容器日志获取重置后的用户名和密码

## 更新日志
[更新日志](https://github.com/EvanFzq/idocker/blob/main/CHANGELOG.md)

# 警告
**该容器拥有宿主机器`docker`的所有权限，请谨慎将容器的端口暴露到外网，暴露到外网使用时请务必使用`https`访问，避免明文传输被攻击导致的密码泄漏**

# 沟通反馈：
QQ群：930498439