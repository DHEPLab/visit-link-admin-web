# Healthy Future Admin Frontend

## 本地开发

NodeJS 版本 v20 LTS

```
$ yarn
$ yarn start
```

## 外部依赖

healthy-future-backend，反向代理配置在 `package.json` proxy 属性

## 部署脚本

```
$ ansible/build.sh
$ ansible/package.sh
$ DEPLOY_GROUP=prod ansible/deploy.sh
```
