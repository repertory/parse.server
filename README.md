# parse.server

全局安装

```
npm install -g parse.server
```

启动命令

```
parse.server      # linux或mac
parse.server.cmd  # windows
```

用法示例

```
const {createServer} = require('http');
const {middleware} = require('parse.server');

createServer(middleware()).listen(8080, () => console.log('Server running on port 8080'));
```
