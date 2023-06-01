# /bin/bash

###
 # @Author: hsycc
 # @Date: 2023-05-11 04:13:27
 # @LastEditTime: 2023-06-01 08:30:08
 # @Description: 
 # 
### 

current_dir=$(dirname "$(readlink -f "$0")")

work_dir=$(dirname "$current_dir")


if [ -z "$1" ]; then
  echo "Missing moudule name"
  exit 1
fi

module=$1

echo "syntax = \"proto3\";

package grpc.$module.v1;

import \"google/protobuf/empty.proto\";

service $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')Service {
  
  rpc Test(google.protobuf.Empty) returns (google.protobuf.Empty);

}" > $work_dir/_proto/$module.proto