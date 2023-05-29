# /bin/bash
###
 # @Author: hsycc
 # @Date: 2023-05-11 04:13:27
 # @LastEditTime: 2023-05-29 23:26:57
 # @Description: 
 # 
### 


current_dir=$(dirname "$(readlink -f "$0")")

work_dir=$(dirname "$current_dir")


#!/bin/bash
if [ -z "$1" ]; then
  echo "Missing moudule name"
  exit 1
fi

module=$1

echo "syntax = \"proto3\";

package grpc.$module.v1;

import \"google/protobuf/empty.proto\";

message HealthCheckRequest { string service = 1; }

message HealthCheckResponse {
  enum ServingStatus {
    UNKNOWN = 0;
    SERVING = 1;
    NOT_SERVING = 2;
    SERVICE_UNKNOWN = 3; // Used only by the Watch method.
  }
  ServingStatus status = 1;
}

service Health {
  rpc check(HealthCheckRequest) returns (HealthCheckResponse);

  rpc watch(HealthCheckRequest) returns (stream HealthCheckResponse);
}


service $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')Service {
  
  rpc test(google.protobuf.Empty) returns (google.protobuf.Empty);

}" > $work_dir/_proto/$module.proto