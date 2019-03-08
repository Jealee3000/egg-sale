# egg-sale

简单的贩卖机api服务

### Development

找到在 config/config.default.js 配置你的数据库环境

```bash
$ npm i
$ npm run dev
```

### Deploy

```bash
$ npm start
$ npm stop
```

### Docker

```bash
docker build -t egg-sale .

# start
docker-compose up -d

# stop
docker-compose down
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.

数据库文档和接口文档在 other.md