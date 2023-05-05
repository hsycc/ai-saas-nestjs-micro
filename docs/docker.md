# docker

Docker Machine 为本地，私有数据中心及公有云平台提供 Docker 引擎，实现从零到 Docker 的一键部署。

Docker Compose 是一个编排多容器分布式部署的工具，提供命令集管理容器化应用的完整开发周期，包括服务构建，启动和停止。

Docker Swarm 为 Docker 容器提供了原生的集群，它将多个 Docker 引擎的资源汇聚在一起，并提供 Docker 标准的 API，使 Docker 可以轻松扩展到多台主机。

Compose 是用来编排和管理多容器应用的工具，使用它，你可以通过定义一个 YAML 文件来定义你的应用的所有服务，然后通过一条命令，你就可以创建并启动所有的服务。

使用 Compose 仅需要三步：

- 使用 Dockerfile 定义你的应用依赖的镜像；
- 使用 docker-compose.yml 定义你的应用(APP)具有的服务；
- 通过 docker-compose up 命令创建并运行应用；

## docs

- [官方文档](https://docs.docker.com/engine/install/centos/)
- [命令清单](https://wangchujiang.com/reference/docs/docker.html)
- [Dockerfile](https://zhuanlan.zhihu.com/p/79142391)
- [docker-compose 详解](https://zhuanlan.zhihu.com/p/515132948)

## docker-compose 常用命令

```bash
# 检查是否有错误
docker-compose config

# 只构建不运行
docker-compose build

#运行compose
docker-compose up -d
# 如果docker-compose文件名不是docker-compose.yml，需要加上-f指定文件
docker-compose up -d -f docker-compose.db.yml

#列出项目中目前所有容器
docker-compose ps -f docker

#停止compose服务
docker-compose stop

#重启compose服务
docker-compose restart

#删除compose服务
docker-compose rm
```
