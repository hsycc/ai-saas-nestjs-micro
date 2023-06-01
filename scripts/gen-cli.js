#! /usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @Author: hsycc
 * @Date: 2023-05-24 23:46:42
 * @LastEditTime: 2023-06-01 08:28:46
 * @Description:
 *
 */

const { Command } = require('commander');
const { execSync } = require('child_process');

const { join } = require('path');
const fs = require('fs');

const workDir = join(__dirname, '..');

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const program = new Command();

program.name('gen-cli').description('CLI').version('1.0.0');

program
  .command('create')
  .description('创建一个完整的微服务，挂载网关服务')
  .requiredOption('-n, --name <name>', '服务名称')
  .option('-p, --port <port>', 'grpc 服务端口')
  .option(`-db, --db <db>', '数据库名称`)
  .action(async (options) => {
    console.log('create new svc server...');

    const name = options.name;

    const port = options.port || 50050;

    const db = options.db || `micro_${name}`;

    try {
      // check 一下是否有同名微服务
      const errRes = [
        execSync(`nest g module ${name} --project api-gateway -d`, {
          encoding: 'utf-8',
        }),
        execSync(`nest g controller ${name} --project api-gateway -d`, {
          encoding: 'utf-8',
        }),
        execSync(`nest g app ${name}-svc -d`, {
          encoding: 'utf-8',
        }),
      ];

      errRes.some((v) => {
        if (!v) {
          throw new Error('服务名称重复');
        }
      });

      // 创建 proto 相关
      execSync(`node ${workDir}/scripts/gen-cli.js gen-proto -n ${name}`);

      // 创建 prisma 相关
      execSync(
        `node ${workDir}/scripts/gen-cli.js gen-prisma -n ${name} --db ${db}`,
      );

      // 创建 svc 服务所依赖的环境变量
      execSync(
        `node ${workDir}/scripts/gen-cli.js gen-svc-env -n ${name} -p ${port}`,
      );

      // 创建 grpc 微服务 svc
      execSync(`node ${workDir}/scripts/gen-cli.js gen-svc -n ${name}`);

      //  在 api-gateway(网关服务) 挂载微服务 svc
      execSync(`node ${workDir}/scripts/gen-cli.js gen-gw -n ${name}`);

      //
      console.log('create new svc server successful.');
    } catch (error) {
      console.error('执行出错:', error);
      process.exit(1);
    }
  });

program
  .command('gen-proto')
  .description('创建 proto 相关')
  .requiredOption('-n, --name <name>', '服务名称')
  .action((options) => {
    console.log('start gen-proto ...');

    const name = options.name;

    // 添加 proto 相关
    execSync(`bash ${workDir}/scripts/gen-proto.sh ${name}`);

    // Makefile 添加编译命令， 编译出 $.pb.ts
    execSync(`echo 'proto-${name}:
		$(call proto-gen,${name},$(DIRNAME_GEN))' >> Makefile`);

    // 编译
    execSync(`make proto-${name}`);

    console.log('gen-proto successful.');
  });

program
  .command('gen-prisma')
  .description('创建 prisma 相关')
  .requiredOption('-n, --name <name>', '服务名称')
  .option(`-db, --db <db>', '数据库名称`)
  .action((options) => {
    console.log('start gen-prisma ...');

    const name = options.name;
    const db = options.db || `micro_${name}`;

    // 环境变量增加 prisma 连接 postgresql 地址以及数据库名
    execSync(
      `echo 'PG_DATABASE_${name.toUpperCase()} = postgresql://\${POSTGRES_USER}:\${POSTGRES_PASSWORD}@\${PG_DB_HOST}:\${PG_DB_PORT}/${db}' >> ${workDir}/.env`,
    );

    //  创建 prisma 相关
    execSync(`bash ${workDir}/scripts/gen-prisma.sh ${name}`);

    // 增加常量 prisma client 命名, nest-prisma 自定义需要
    execSync(
      `echo "export const PRISMA_CLIENT_NAME_${name.toUpperCase()} = 'PRISMA_CLIENT_NAME_${name.toUpperCase()}';" >> ${workDir}/prisma/scripts/constants.ts`,
    );

    // init prisma-client
    execSync(`npx prisma generate --schema=${workDir}/prisma/${name}.prisma`);

    // 同步数据库
    // execSync(`npx prisma db push --schema=prisma/${name}.prisma`);

    //  创建 seed.ts 预设
    // execSync()
    console.log('gen-prisma successful.');
  });

program
  .command('gen-svc-env')
  .description('创建 svc 服务所依赖的环境变量')
  .requiredOption('-n, --name <name>', '服务名称')
  .option('-p, --port <port>', 'grpc 服务端口')
  .action((options) => {
    console.log('start gen-svc-env ...');

    const name = options.name;

    const port = options.port || 50050;

    // update .env file  抽象封装
    execSync(
      `echo "MICRO_SERVER_ADDR_${name.toUpperCase()} = 127.0.0.1:${port}" >> ${workDir}/.env`,
    );

    execSync(
      `echo "MICRO_PORT_${name.toUpperCase()} = ${port}" >> ${workDir}/.env`,
    );

    console.log('gen-svc-env  successful.');
  });

program
  .command('gen-gw')
  .description(' 在 api-gateway(网关服务) 挂载微服务 svc')
  .requiredOption('-n, --name <name>', '服务名称')
  .action((options) => {
    console.log('start gen-gw ...');
    const name = options.name;

    try {
      // 网关服务创建 module controller
      const errRes = [
        execSync(`nest g module ${name} --project api-gateway`, {
          encoding: 'utf-8',
        }),
        execSync(`nest g controller ${name} --project api-gateway`, {
          encoding: 'utf-8',
        }),
      ];

      errRes.some((v) => {
        if (!v) {
          throw new Error('服务名称重复');
        }
      });

      //  修改 libs/config interface
      execSync(
        `sed -i '' "s#// sedMicroConfigUnRemove#microServerAddr${capitalizeFirstLetter(
          name,
        )}: string;\\n  microPort${capitalizeFirstLetter(
          name,
        )}: string;\\n  // sedMicroConfigUnRemove#g" ${workDir}/libs/config/src/interface.ts`,
      );

      //  修改 libs/config micro.ts
      execSync(
        `sed -i '' "s#// sedMicroConfigUnRemove#microServerAddr${capitalizeFirstLetter(
          name,
        )}: process.env.MICRO_SERVER_ADDR_${name.toUpperCase()},\\n  microPort${capitalizeFirstLetter(
          name,
        )}: process.env.MICRO_PROTO_${name.toUpperCase()},\\n  // sedMicroConfigUnRemove#g" ${workDir}/libs/config/src/micro.ts`,
      );

      execSync(`bash ${workDir}/scripts/gen-gateway-controller.sh ${name}`);

      execSync(`bash ${workDir}/scripts/gen-gateway-module.sh ${name}`);

      // TODO: replace api-gateway healthModule healthService

      console.log('gen-gw  successful.');
    } catch (error) {
      console.error('执行出错:', error);
      process.exit(1);
    }
  });

program
  .command('gen-svc')
  .description('只创建 grpc 微服务 svc')
  .requiredOption('-n, --name <name>', '服务名称')
  .action(async (options) => {
    console.log('start gen-svc ...');
    const name = options.name;
    try {
      // nest-cli 创建 new app
      const output = execSync(`nest g app ${name}-svc --no-spec`);

      if (!output) {
        throw new Error('服务名称重复');
      }

      // 剔除无用文件
      execSync(
        `rm -rf ${workDir}/apps/${name}-svc/src/${name}-svc.controller*`,
      );
      execSync(`rm -rf ${workDir}/apps/${name}-svc/src/${name}-svc.service.ts`);

      execSync(`rm -rf ${workDir}/apps/${name}-svc/test/app.e2e-spec.ts`);

      // 定义 服务 常量名

      execSync(
        `echo "export const MICRO_SERVER_NAME_${name.toUpperCase()} = 'ai-sass-${name}-svc';" >> ${workDir}/apps/${name}-svc/src/constants.ts`,
      );

      execSync(
        `echo "export const MICRO_PROTO_${name.toUpperCase()} = '_proto/${name}.proto';" >> ${workDir}/apps/${name}-svc/src/constants.ts`,
      );

      // 复制 健康检查模块 healthModule
      execSync(
        `cp -r  ${workDir}/apps/ai-svc/src/health  ${workDir}/apps/${name}-svc/src/`,
      );

      // svc-module.ts 模板替换
      execSync(`bash ${workDir}/scripts/gen-svc-module.sh ${name}`);

      //svc main.ts 模板替换
      execSync(`bash ${workDir}/scripts/gen-svc-main.sh ${name}`);

      //  tsconfig.json 增加映射
      const tsconfigPath = workDir + '/tsconfig.json';
      const rawData = fs.readFileSync(tsconfigPath);
      const jsonData = JSON.parse(rawData);
      jsonData.compilerOptions.paths[`@app/${name}-svc/*`] = [
        `apps/${name}-svc/src/*`,
      ];
      const updatedData = JSON.stringify(jsonData, null, 2);
      fs.writeFileSync(tsconfigPath, updatedData);

      console.log('gen-svc  successful.');
    } catch (error) {
      console.error('执行出错:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);
