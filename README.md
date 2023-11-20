# iDocker（Docker移动端管理工具）
## 前言
很多人有在移动端管理`docker`的需求，目前市面上常见的开源`docker`管理工具都只针对桌面做了适配，在手机上操作非常不方便，所以才有了此项目

## 功能规划
这一个在移动端网页管理`docker`的工具，目前的功能支持及规划如下

- [x] 用户登录、注销、修改密码 
- [x] 查看容器列表、容器详细配置、容器日志 
- [x] 容器启动、暂停、恢复、停止、重启、移除等基本操作 
- [x] 支持PWA模式 
- [x] 创建容器 
- [x] 管理镜像 
- [x] 管理网络 
- [x] 管理数据卷 
- [x] 修改更新容器
- [x] 导航页
- [x] 事件通知
- [ ] 桌面端适配
- [ ] 多环境管理
- [ ] 支持模版创建、管理模版
- [ ] 支持模版市场
- [ ] 支持多语言
  
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

# 警告
**该容器拥有宿主机器`docker`的所有权限，请谨慎将容器的端口暴露到外网，暴露到外网使用时请务必使用`https`访问，避免明文传输被攻击导致的密码泄漏**

# 沟通反馈：
QQ群：930498439