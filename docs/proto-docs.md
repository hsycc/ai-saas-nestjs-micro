# Protocol Documentation
<a name="top"></a>

## Table of Contents

- [ai.proto](#ai-proto)
    - [ChatCompletionRequestMessage](#ai-ChatCompletionRequestMessage)
    - [ChatModel](#ai-ChatModel)
    - [ChatModelList](#ai-ChatModelList)
    - [ChatModelStructItem](#ai-ChatModelStructItem)
    - [CreateChatCompletionChoicesResponse](#ai-CreateChatCompletionChoicesResponse)
    - [CreateChatCompletionRequest](#ai-CreateChatCompletionRequest)
    - [CreateChatCompletionResponseChoicesInner](#ai-CreateChatCompletionResponseChoicesInner)
    - [CreateChatModelRequest](#ai-CreateChatModelRequest)
    - [Pagination](#ai-Pagination)
    - [QueryChatModelByIdRequest](#ai-QueryChatModelByIdRequest)
    - [QueryChatModelListRequest](#ai-QueryChatModelListRequest)
    - [UpdateChatModelRequest](#ai-UpdateChatModelRequest)
  
    - [StatusEnum](#ai-StatusEnum)
  
    - [AiChatModelService](#ai-AiChatModelService)
    - [AiService](#ai-AiService)
  
- [common.proto](#common-proto)
    - [StatusEnum](#-StatusEnum)
  
- [gpt.proto](#gpt-proto)
    - [FindOneRequest](#gpt-FindOneRequest)
    - [FindOneResponse](#gpt-FindOneResponse)
  
    - [GptService](#gpt-GptService)
  
- [user.proto](#user-proto)
    - [CreateUserRequest](#user-CreateUserRequest)
    - [QueryUserByAccessKeyRequest](#user-QueryUserByAccessKeyRequest)
    - [QueryUserByIdRequest](#user-QueryUserByIdRequest)
    - [QueryUserByNameRequest](#user-QueryUserByNameRequest)
    - [UpdateUserRequest](#user-UpdateUserRequest)
    - [UserModel](#user-UserModel)
    - [UserModelList](#user-UserModelList)
  
    - [UserRolesEnum](#user-UserRolesEnum)
    - [UserStatusEnum](#user-UserStatusEnum)
  
    - [UserService](#user-UserService)
  
- [Scalar Value Types](#scalar-value-types)



<a name="ai-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## ai.proto



<a name="ai-ChatCompletionRequestMessage"></a>

### ChatCompletionRequestMessage
alias openai ChatCompletionRequestMessage


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| role | [string](#string) | optional |  |
| content | [string](#string) | optional |  |
| name | [string](#string) | optional |  |






<a name="ai-ChatModel"></a>

### ChatModel



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| provider | [string](#string) |  |  |
| model | [string](#string) |  |  |
| name | [string](#string) |  |  |
| struct | [ChatModelStructItem](#ai-ChatModelStructItem) | repeated |  |
| questionTpl | [string](#string) |  |  |
| status | [StatusEnum](#ai-StatusEnum) |  |  |
| userId | [string](#string) |  |  |
| createdAt | [double](#double) |  |  |
| updatedAt | [double](#double) |  |  |






<a name="ai-ChatModelList"></a>

### ChatModelList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [ChatModel](#ai-ChatModel) | repeated |  |
| pagination | [Pagination](#ai-Pagination) |  |  |






<a name="ai-ChatModelStructItem"></a>

### ChatModelStructItem



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [string](#string) |  |  |






<a name="ai-CreateChatCompletionChoicesResponse"></a>

### CreateChatCompletionChoicesResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| choices | [CreateChatCompletionResponseChoicesInner](#ai-CreateChatCompletionResponseChoicesInner) | repeated |  |






<a name="ai-CreateChatCompletionRequest"></a>

### CreateChatCompletionRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| chaModelId | [string](#string) | optional |  |
| question | [string](#string) |  |  |
| messages | [ChatCompletionRequestMessage](#ai-ChatCompletionRequestMessage) | repeated |  |






<a name="ai-CreateChatCompletionResponseChoicesInner"></a>

### CreateChatCompletionResponseChoicesInner
alia openai CreateChatCompletionResponseChoicesInner


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| index | [int32](#int32) | optional |  |
| message | [ChatCompletionRequestMessage](#ai-ChatCompletionRequestMessage) | optional |  |
| finish_reason | [string](#string) | optional |  |






<a name="ai-CreateChatModelRequest"></a>

### CreateChatModelRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| provider | [string](#string) | optional |  |
| model | [string](#string) | optional |  |
| name | [string](#string) |  |  |
| struct | [ChatModelStructItem](#ai-ChatModelStructItem) | repeated |  |
| questionTpl | [string](#string) | optional |  |






<a name="ai-Pagination"></a>

### Pagination



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| current | [int32](#int32) |  |  |
| pageSize | [int32](#int32) |  |  |
| total | [int32](#int32) |  |  |






<a name="ai-QueryChatModelByIdRequest"></a>

### QueryChatModelByIdRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |






<a name="ai-QueryChatModelListRequest"></a>

### QueryChatModelListRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| current | [int32](#int32) | optional |  |
| pageSize | [int32](#int32) | optional |  |






<a name="ai-UpdateChatModelRequest"></a>

### UpdateChatModelRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| name | [string](#string) | optional |  |
| struct | [ChatModelStructItem](#ai-ChatModelStructItem) | repeated |  |
| questionTpl | [string](#string) | optional |  |





 


<a name="ai-StatusEnum"></a>

### StatusEnum


| Name | Number | Description |
| ---- | ------ | ----------- |
| DISABLE | 0 |  |
| ENABLE | 1 |  |


 

 


<a name="ai-AiChatModelService"></a>

### AiChatModelService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| createChatModel | [CreateChatModelRequest](#ai-CreateChatModelRequest) | [ChatModel](#ai-ChatModel) |  |
| deleteChatModel | [QueryChatModelByIdRequest](#ai-QueryChatModelByIdRequest) | [.google.protobuf.Empty](#google-protobuf-Empty) |  |
| updateChatModel | [UpdateChatModelRequest](#ai-UpdateChatModelRequest) | [.google.protobuf.Empty](#google-protobuf-Empty) |  |
| getChatModelById | [QueryChatModelByIdRequest](#ai-QueryChatModelByIdRequest) | [ChatModel](#ai-ChatModel) |  |
| getChatModelList | [QueryChatModelListRequest](#ai-QueryChatModelListRequest) | [ChatModelList](#ai-ChatModelList) |  |
| createChatCompletion | [CreateChatCompletionRequest](#ai-CreateChatCompletionRequest) | [CreateChatCompletionChoicesResponse](#ai-CreateChatCompletionChoicesResponse) |  |


<a name="ai-AiService"></a>

### AiService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| test | [.google.protobuf.Empty](#google-protobuf-Empty) | [.google.protobuf.Empty](#google-protobuf-Empty) |  |

 



<a name="common-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## common.proto


 


<a name="-StatusEnum"></a>

### StatusEnum


| Name | Number | Description |
| ---- | ------ | ----------- |
| DISABLE | 0 |  |
| ENABLE | 1 |  |


 

 

 



<a name="gpt-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## gpt.proto



<a name="gpt-FindOneRequest"></a>

### FindOneRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  |  |






<a name="gpt-FindOneResponse"></a>

### FindOneResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| text | [string](#string) |  |  |





 

 

 


<a name="gpt-GptService"></a>

### GptService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Stt | [FindOneRequest](#gpt-FindOneRequest) | [FindOneResponse](#gpt-FindOneResponse) |  |

 



<a name="user-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## user.proto



<a name="user-CreateUserRequest"></a>

### CreateUserRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| username | [string](#string) |  |  |
| password | [string](#string) |  |  |






<a name="user-QueryUserByAccessKeyRequest"></a>

### QueryUserByAccessKeyRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| accessKey | [string](#string) |  |  |






<a name="user-QueryUserByIdRequest"></a>

### QueryUserByIdRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |






<a name="user-QueryUserByNameRequest"></a>

### QueryUserByNameRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| username | [string](#string) |  |  |






<a name="user-UpdateUserRequest"></a>

### UpdateUserRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| avatar | [string](#string) | optional |  |
| password | [string](#string) | optional |  |
| status | [UserStatusEnum](#user-UserStatusEnum) | optional |  |
| role | [UserRolesEnum](#user-UserRolesEnum) | optional |  |
| accessKey | [string](#string) | optional |  |
| secretKey | [string](#string) | optional |  |






<a name="user-UserModel"></a>

### UserModel



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| username | [string](#string) |  |  |
| avatar | [string](#string) |  |  |
| password | [string](#string) |  |  |
| status | [UserStatusEnum](#user-UserStatusEnum) |  |  |
| role | [UserRolesEnum](#user-UserRolesEnum) |  |  |
| accessKey | [string](#string) |  |  |
| secretKey | [string](#string) |  |  |
| createdAt | [double](#double) |  |  |
| updatedAt | [double](#double) |  |  |






<a name="user-UserModelList"></a>

### UserModelList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| results | [UserModel](#user-UserModel) | repeated |  |





 


<a name="user-UserRolesEnum"></a>

### UserRolesEnum


| Name | Number | Description |
| ---- | ------ | ----------- |
| ADMIN | 0 |  |
| USER | 1 |  |



<a name="user-UserStatusEnum"></a>

### UserStatusEnum


| Name | Number | Description |
| ---- | ------ | ----------- |
| DISABLE | 0 |  |
| ENABLE | 1 |  |


 

 


<a name="user-UserService"></a>

### UserService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| createUser | [CreateUserRequest](#user-CreateUserRequest) | [UserModel](#user-UserModel) |  |
| deleteUser | [QueryUserByIdRequest](#user-QueryUserByIdRequest) | [.google.protobuf.Empty](#google-protobuf-Empty) |  |
| updateUser | [UpdateUserRequest](#user-UpdateUserRequest) | [.google.protobuf.Empty](#google-protobuf-Empty) |  |
| getUserByAccessKey | [QueryUserByAccessKeyRequest](#user-QueryUserByAccessKeyRequest) | [UserModel](#user-UserModel) |  |
| getUserByName | [QueryUserByNameRequest](#user-QueryUserByNameRequest) | [UserModel](#user-UserModel) |  |
| getUserById | [QueryUserByIdRequest](#user-QueryUserByIdRequest) | [UserModel](#user-UserModel) |  |
| getUserModelList | [.google.protobuf.Empty](#google-protobuf-Empty) | [UserModelList](#user-UserModelList) |  |

 



## Scalar Value Types

| .proto Type | Notes | C++ | Java | Python | Go | C# | PHP | Ruby |
| ----------- | ----- | --- | ---- | ------ | -- | -- | --- | ---- |
| <a name="double" /> double |  | double | double | float | float64 | double | float | Float |
| <a name="float" /> float |  | float | float | float | float32 | float | float | Float |
| <a name="int32" /> int32 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="int64" /> int64 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="uint32" /> uint32 | Uses variable-length encoding. | uint32 | int | int/long | uint32 | uint | integer | Bignum or Fixnum (as required) |
| <a name="uint64" /> uint64 | Uses variable-length encoding. | uint64 | long | int/long | uint64 | ulong | integer/string | Bignum or Fixnum (as required) |
| <a name="sint32" /> sint32 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="sint64" /> sint64 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="fixed32" /> fixed32 | Always four bytes. More efficient than uint32 if values are often greater than 2^28. | uint32 | int | int | uint32 | uint | integer | Bignum or Fixnum (as required) |
| <a name="fixed64" /> fixed64 | Always eight bytes. More efficient than uint64 if values are often greater than 2^56. | uint64 | long | int/long | uint64 | ulong | integer/string | Bignum |
| <a name="sfixed32" /> sfixed32 | Always four bytes. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="sfixed64" /> sfixed64 | Always eight bytes. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="bool" /> bool |  | bool | boolean | boolean | bool | bool | boolean | TrueClass/FalseClass |
| <a name="string" /> string | A string must always contain UTF-8 encoded or 7-bit ASCII text. | string | String | str/unicode | string | string | string | String (UTF-8) |
| <a name="bytes" /> bytes | May contain any arbitrary sequence of bytes. | string | ByteString | str | []byte | ByteString | string | String (ASCII-8BIT) |

