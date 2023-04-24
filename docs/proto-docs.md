# Protocol Documentation
<a name="top"></a>

## Table of Contents

- [auth.proto](#auth-proto)
    - [LoginRequest](#auth-LoginRequest)
    - [LoginResponse](#auth-LoginResponse)
    - [RegisterRequest](#auth-RegisterRequest)
    - [RegisterResponse](#auth-RegisterResponse)
    - [ValidateRequest](#auth-ValidateRequest)
    - [ValidateResponse](#auth-ValidateResponse)
  
    - [AuthService](#auth-AuthService)
  
- [order.proto](#order-proto)
    - [CreateOrderRequest](#order-CreateOrderRequest)
    - [CreateOrderResponse](#order-CreateOrderResponse)
  
    - [OrderService](#order-OrderService)
  
- [product.proto](#product-proto)
    - [CreateProductRequest](#product-CreateProductRequest)
    - [CreateProductResponse](#product-CreateProductResponse)
    - [DecreaseStockRequest](#product-DecreaseStockRequest)
    - [DecreaseStockResponse](#product-DecreaseStockResponse)
    - [FindOneData](#product-FindOneData)
    - [FindOneRequest](#product-FindOneRequest)
    - [FindOneResponse](#product-FindOneResponse)
  
    - [ProductService](#product-ProductService)
  
- [Scalar Value Types](#scalar-value-types)



<a name="auth-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## auth.proto



<a name="auth-LoginRequest"></a>

### LoginRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| email | [string](#string) |  |  |
| password | [string](#string) |  |  |






<a name="auth-LoginResponse"></a>

### LoginResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| status | [int32](#int32) |  |  |
| error | [string](#string) | repeated |  |
| token | [string](#string) |  |  |






<a name="auth-RegisterRequest"></a>

### RegisterRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| email | [string](#string) |  |  |
| password | [string](#string) |  |  |






<a name="auth-RegisterResponse"></a>

### RegisterResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| status | [int32](#int32) |  |  |
| error | [string](#string) | repeated |  |






<a name="auth-ValidateRequest"></a>

### ValidateRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| token | [string](#string) |  |  |






<a name="auth-ValidateResponse"></a>

### ValidateResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| status | [int32](#int32) |  |  |
| error | [string](#string) | repeated |  |
| userId | [int32](#int32) |  |  |





 

 

 


<a name="auth-AuthService"></a>

### AuthService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Register | [RegisterRequest](#auth-RegisterRequest) | [RegisterResponse](#auth-RegisterResponse) |  |
| Login | [LoginRequest](#auth-LoginRequest) | [LoginResponse](#auth-LoginResponse) |  |
| Validate | [ValidateRequest](#auth-ValidateRequest) | [ValidateResponse](#auth-ValidateResponse) |  |

 



<a name="order-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## order.proto



<a name="order-CreateOrderRequest"></a>

### CreateOrderRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| productId | [int32](#int32) |  |  |
| quantity | [int32](#int32) |  |  |
| userId | [int32](#int32) |  |  |






<a name="order-CreateOrderResponse"></a>

### CreateOrderResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| status | [int32](#int32) |  |  |
| error | [string](#string) | repeated |  |
| id | [int32](#int32) |  |  |





 

 

 


<a name="order-OrderService"></a>

### OrderService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| CreateOrder | [CreateOrderRequest](#order-CreateOrderRequest) | [CreateOrderResponse](#order-CreateOrderResponse) |  |

 



<a name="product-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## product.proto



<a name="product-CreateProductRequest"></a>

### CreateProductRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| name | [string](#string) |  |  |
| sku | [string](#string) |  |  |
| stock | [int32](#int32) |  |  |
| price | [double](#double) |  |  |






<a name="product-CreateProductResponse"></a>

### CreateProductResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| status | [int32](#int32) |  |  |
| error | [string](#string) | repeated |  |
| id | [int32](#int32) |  |  |






<a name="product-DecreaseStockRequest"></a>

### DecreaseStockRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  |  |






<a name="product-DecreaseStockResponse"></a>

### DecreaseStockResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| status | [int32](#int32) |  |  |
| error | [string](#string) | repeated |  |






<a name="product-FindOneData"></a>

### FindOneData



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  |  |
| name | [string](#string) |  |  |
| sku | [string](#string) |  |  |
| stock | [int32](#int32) |  |  |
| price | [double](#double) |  |  |






<a name="product-FindOneRequest"></a>

### FindOneRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  |  |






<a name="product-FindOneResponse"></a>

### FindOneResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| status | [int32](#int32) |  |  |
| error | [string](#string) | repeated |  |
| data | [FindOneData](#product-FindOneData) |  |  |





 

 

 


<a name="product-ProductService"></a>

### ProductService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| CreateProduct | [CreateProductRequest](#product-CreateProductRequest) | [CreateProductResponse](#product-CreateProductResponse) |  |
| FindOne | [FindOneRequest](#product-FindOneRequest) | [FindOneResponse](#product-FindOneResponse) |  |
| DecreaseStock | [DecreaseStockRequest](#product-DecreaseStockRequest) | [DecreaseStockResponse](#product-DecreaseStockResponse) |  |

 



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

