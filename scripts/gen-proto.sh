# /bin/bash
###
 # @Author: hsycc
 # @Date: 2023-05-11 04:13:27
 # @LastEditTime: 2023-05-25 15:39:39
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

package $module;

import \"google/protobuf/empty.proto\";

service $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')Service {
  
   rpc test(google.protobuf.Empty) returns (google.protobuf.Empty);

}" > $work_dir/_proto/$module.proto