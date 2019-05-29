#!/usr/bin/env node

const cluster = require('cluster');
const args = require('args');

args
  .option('config', '配置文件', '')
  .option('instances', 'clusters数量', -1)
  .option('port', '端口号', 8080);

const flags = args.parse(process.argv);

if (flags.instances >= 0 && cluster.isMaster) {
  const os = require('os');
  const instances = flags.instances || os.cpus().length;

  for (let i = 0; i < instances; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    cluster.fork();
  });
} else {
  const http = require('http');
  const parse = require('./index');
  const config = parse.config(flags.config || undefined);
  const server = http.createServer(parse.middleware(config)).listen(flags.port, () => console.log(`Server running on port ${flags.port}`));

  if (config.apps[0].liveQuery) {
    const redisURL = config.apps[0].liveQuery.redisURL || undefined;
    if (redisURL) {
      parse.server.createLiveQueryServer(server, {
        redisURL: redisURL
      });
    } else {
      parse.server.createLiveQueryServer(server);
    }
  }
}