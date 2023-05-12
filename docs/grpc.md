<!--
 * @Author: hsycc
 * @Date: 2023-05-05 04:04:36
 * @LastEditTime: 2023-05-12 10:44:59
 * @Description:
 *
-->

# gRPC

[Protocol Buffers Documentation](https://protobuf.dev/programming-guides/proto3/)
[Protobuf3 语言指南](https://github.com/lixiangyun/protobuf_doc_ZH_CN/blob/master/README.md)
[Nestjs gRPC](https://docs.nestjs.com/microservices/grpc)
[ts-proto](https://github.com/stephenh/ts-proto)
[2 分钟学会 Protocol Buffer 语法](https://juejin.cn/post/7028110964763410445)

### proto3

```ts
// 时间戳 double

// 可选 optional

// 定义 字段 为json
//  google.protobuf.Struct struct = 1

// 定义 字段 为 数组
//  message ChatModelList { repeated ChatModel results = 1; }
```

### 编译

```bash
  # 编译 proto
  make proto-all
  make proto-user
  make ...

  # 构建 proto 文档
  bash script/generate-proto-docs.sh

```
