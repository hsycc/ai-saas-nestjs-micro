# 鉴权认证机制

## 概述

当您将 HTTP 请求发送时，您需要对您的请求进行签名计算并生成认证字符串，以便可以识别您的身份。访问密钥来进行签名计算，该访问密钥包含访问密钥 ID(Access Key Id, 后文简称 AK)和秘密访问密钥(Secret Access Key, 后文简称 SK).

## 生成公式

V1 版本认证字符串的生成公式如下：
cc-auth-v1/{accessKeyId}/{timestamp}/{expirationPeriodInSeconds}/{signedHeaders}/{signature}

主要包含了 3 部分，即前缀字符串(authStringPrefix)、签名头域(signedHeaders)和签名摘要(signature)，其中：

前缀字符串(authStringPrefix)：cc-auth-v1/{accessKeyId}/{timestamp}/{expirationPeriodInSeconds}，都是可获得的参数；

签名头域(signedHeaders)：即签名算法中涉及到的 HTTP 头域列表，将在下文中详细描述

签名摘要(signature)：为计算所得，将在下文中详细描述

## 编码生成步骤

使用编码方式生成最终的认证字符串，您需要完成如下 4 个子步骤：

- 步骤一：创建前缀字符串(authStringPrefix)
- 步骤二：创建规范请求(canonicalRequest)，确定签名头域(signedHeaders)
- 步骤三：生成派生签名密钥(signingKey)
- 步骤四：生成签名摘要(signature)，并拼接最终的认证字符串(x-authorization)
  从认证字符串格式可以看出，除了参数签名摘要(signature)外，其他参数都是已知或可设置的。 下面详细介绍签名的生成过程，进而得出认证字符串。

签名的计算公式为 signature = HMAC-SHA256-HEX(SigningKey,CanonicalRequest)，从公式可以看出，想要获得签名需要得到 SigningKey 和 CanonicalRequest 两个参数，首先介绍如何获取这两个参数。

## 步骤一：创建前缀字符串(authStringPrefix)

创建前缀字符串，即将已知参数拼接为如下形式：

cc-auth-v1/{accessKeyId}/{timestamp}/{expirationPeriodInSeconds}

其中：

- accessKeyId： Access Key ID，请参看获取 AK/SK 来获取。
- timestamp：生成签名的 UTC 时间，格式为 yyyy-mm-ddThh:mm:ssZ，例如：2015-04-27T08:23:49Z，请注意请求发送时间不能晚于生成签名时间太多，否则请求到达服务端时可能已经超过签名的有效期限。
- expirationPeriodInSeconds：签名有效期限，从 timestamp 所指定的时间开始计算，单位为秒。

上述参数拼接：cc-auth-v1/{accessKeyId}/{timestamp}/{expirationPeriodInSeconds}，组成了认证字符串前缀 authStringPrefix。

## 步骤二：创建规范请求(canonicalRequest)，确定签名头域(signedHeaders)

CanonicalRequest 的计算公式为：

CanonicalRequest = HTTP Method + "\n" + CanonicalURI + "\n" + CanonicalQueryString + "\n" + CanonicalHeaders，

### 1.HTTP Method

指 HTTP 协议中定义的 GET、PUT、POST 等请求，必须使用全大写的形式。所涉及的 HTTP Method 有如下五种。

```
 GET
 POST
 PUT
 DELETE
 HEAD
```

### 2.CanonicalURI

CanonicalURI 是对 URL 中的绝对路径进行编码后的结果，即 CanonicalURI = encodeURI(Path)。要求绝对路径 Path 必须以“/”开头，不以“/”开头的需要补充上，空路径为“/”。

- 举例：
  若 URL 为 ”https://xxxx.com/example/测试“ , 则其 URL Path 为 ”/example/测试“ , 将之规范化得到 CanonicalURI 为 ”/example/%E6%B5%8B%E8%AF%95“

> 说明：
>
> 1. encodeURI 的含义及功能请参考相关函数说明。

### 3.CanonicalQueryString

CanonicalQueryString 对于 URL 中的 Query String（Query String 即 URL 中“?”后面的“key1=valve1&key2=valve2”字符串）进行编码后的结果。

#### 编码步骤

1. 提取 URL 中的 Query String 项，即 URL 中“?”后面的“key1=valve1&key2=valve2”字符串

2. 将 Query String 根据&拆开成若干项，每一项是 key=value 或者只有 key 的形式。

3. 对拆开后的每一项进行编码处理，分以下三种情况。

   - 当该项的 key 是 x-authorization 时，直接忽略该项。
   - 当该项只有 key 时，转换公式为 encodeURIComponent(key) + "="的形式。
   - 当该项是 key=value 的形式时，转换公式为 encodeURIComponent(key) + "=" + encodeURIComponent(value) 的形式。这里 value 可以是空字符串。

4. 将每一项转换后的字符串按照字典顺序（ASCII 码由小到大）排序，并使用 & 符号连接起来，生成相应的 CanonicalQueryString。

> 说明：
>
> 1. encodeURIComponent 的含义及功能请参考相关函数说明。

#### 编码示例

获取 URL 为 "https://xxxxxxxxxx.com/example?text&text1=测试&text10=test" 的 CanonicalQueryString

1. 提取 URL 中的 Query String，得到 text&text1=测试&text10=test。

2. 根据&对 Query String 进行拆分，得到 text 、text1=测试 、 text10=test 三项。

3. 对拆分的每一项进行编码。

   - 对 text 项进行编码：encodeURIComponent("text") + "="，得到"text="
   - 对 text1=测试项进行编码：encodeURIComponent("text1") + "=" + encodeURIComponent("测试")，得到"text1=%E6%B5%8B%E8%AF%95"
   - 对 text10=test 项进行编码：encodeURIComponent("text10") + "=" + encodeURIComponent("test")，得到"text10=test"

4. 对上面三项编码后的字符串进行（按照 ASCII 码由小到大）排序，得到结果是 text10=test 、text1=%E6%B5%8B%E8%AF%95 、text= ，然后用&连接起来，得到 CanonicalQueryString 为 text10=test&text1=%E6%B5%8B%E8%AF%95&text=。

展示了如何处理只有 key 的项，非英文的 value，以及数字和=进行排序。在实际的 API 中，因为参数起名是规范的，基本不会遇到这样的排序。正常的排序结果和只按照 key 进行排序是完全一致的。算法中有这个约束主要是出于定义严密性的考虑。

### 4.CanonicalHeaders

CanonicalHeaders 是对 HTTP 请求中的 Header 部分进行选择性编码的结果。

编码步骤如下：

1. 选择编码的 Header。 您可以自行决定哪些 Header 需要编码。唯一要求是 Host 域必须被编码。大多数情况下，我们推荐您对以下 Header 进行编码：

   - Host
   - Content-Length
   - Content-Type
   - Content-MD5
   - 所有以 x-cc- 开头的 Header

> 说明
>
> 1. 选择哪些 Header 进行编码不会影响 API 的功能，但是如果选择太少则可能遭到中间人攻击。

2. 对 Header 进行编码获取 CanonicalHeaders，编码步骤如下。

   - 将 Header 的名字变成全小写，注意仅改名字。
   - 将 Header 的值去掉开头和结尾的空白字符。
   - 经过上一步之后值为空字符串的 Header 忽略，其余的转换为 encodeURIComponent(name) + ":" + encodeURIComponent(value) 的形式。
   - 把上面转换后的所有字符串按照字典序进行排序。
   - 将排序后的字符串按顺序用 \n 符号连接起来得到最终的 CanonicalHeaders。

> 说明：
>
> 1. encodeURIComponent 的含义及功能请参考相关函数说明。
> 2. 很多发送 HTTP 请求的第三方库，会添加或者删除你指定的 header（例如：某些库会删除 content-length:0 这个 header），如果签名错误，请检查您真实发出的 http 请求的 header，看看是否与签名时的 header 一样。

#### 编码示例

该示例演示使用推荐范围之外的 Header 进行编码，此时 signedHeaders 不能为空（默认值）。

如下是发送请求的 Header:

```
Host: test.com
Date: Mon, 27 Apr 2015 16:23:49 +0800
Content-Type: text/plain
Content-Length: 8
Content-Md5: KasdcPqhviXdjRNnxcko4rw==
```

1. 选择需要编码的 Header，然后把所有名字都改为小写, 将 Header 的值去掉开头和结尾的空白字符。

```
host:test.com
date:Mon, 27 Apr 2015 16:23:49 +0800
content-type:text/plain
content-length:8
content-md5:NFzcPqhviddjRNnSOGo4rw%3D%3Dx
```

2. 对每个 Header 进行 encodeURIComponent 转换。

```
host:test.com
date:Mon%2C%2027%20Apr%202015%2016%3A23%3A49%20%2B0800
content-type:text%2Fplain
content-length:8
content-md5:NFzcPqhviddjRNnSOGo4rw%3D%3Dx
```

3. 将步骤 3 中转换后的所有字符串按照字典序进行排序。

```
content-length:8
content-md5:NFzcPqhviddjRNnSOGo4rw%3D%3Dx
content-type:text%2Fplain
date:Mon%2C%2027%20Apr%202015%2016%3A23%3A49%20%2B0800
host:test.com
```

4. 将排序后的字符串按顺序用\n 符号连接起来得到最终结果。

```
content-length:8
content-md5:NFzcPqhviddjRNnSOGo4rw%3D%3Dx
content-type:text%2Fplain
date:Mon%2C%2027%20Apr%202015%2016%3A23%3A49%20%2B0800
host:test.com
```

5. 同时获得认证字符串的 signedHeaders 内容应该是 content-length;content-md5;content-type;date;host。

> 注意： CanonicalHeaders 和 signedHeaders 的排序不一样，这是因为 signedHeaders 是根据 Header 的 name 进行排序的， x-cc-meta-data 放在 x-cc-meta-data-tag 之前。但是在 CanonicalHeaders 中是按照 name 和 value 合成的整个字符串进行排序的，因为在 name 和 value 之间还有一个冒号（:），而冒号的 ASCII 码值要大于连字号（-）的 ASCII 码值，因此 x-cc-meta-data 反而放在了 x-cc-meta-data-tag 之后。

## 步骤三：生成派生密钥(signingKey)

SigningKey = HMAC-SHA256-HEX(sk, authStringPrefix)，其中：

- HMAC-SHA256-HEX 是 HMAC SHA256 算法函数。
- sk 为用户的 Secret Access Key
- authStringPrefix 代表认证字符串的前缀部分，即：cc-auth-v1/{accessKeyId}/{timestamp}/{expirationPeriodInSeconds}。

## 步骤四：生成签名摘要及认证字符串(x-authorization)

通过上面的计算得到的 SigningKey 和 CanonicalRequest 按照下面公式可以得到签名。
Signature = HMAC-SHA256-HEX(SigningKey, CanonicalRequest)

其中：

- HMAC-SHA256-HEX 是 HMAC SHA256 算法函数，具体功能及描述参见相关函数说明。

最后由公式 x-auth-v1/{accessKeyId}/{timestamp}/{expirationPeriodInSeconds}/{signedHeaders}/{signature}得到认证字符串。

## 认证字符串示例

## 相关的函数说明

| 函数名               | 功能描述                                                                                                                  |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| HMAC-SHA256-HEX()    | 调用 HMAC SHA256 算法，根据开发者提供的密钥（key）和密文（message）输出密文摘要，并把结果转换为小写形式的十六进制字符串。 |
| toLowercase()        | 将字符串全部变成小写。                                                                                                    |
| trim()               | 去掉字符串开头和结尾的空白字符。                                                                                          |
| encodeURI()          |                                                                                                                           |
| encodeURIComponent() |                                                                                                                           |

## 在 Header 中包含认证字符串

在 HTTP 请求的 Header 中包含 x-authorization 信息，以验证请求者身份有效性，即：在 HTTP Header 中加入 x-authorization: <认证字符串>。

## 在 URL 中包含认证字符串

除了使用 x-authorization Header，用户还可以在 URL 中加入认证字符串，具体方法是在 URL 的 Query String 中加入 x-authorization = <认证字符串>。

在 URL 中包含认证字符串常用于生成 URL 给第三方使用的场景，例如要临时把某个数据开放给他人下载。

## 错误码

| 错误返回码            | 状态码                    | 说明                                                                                         |
| :-------------------- | :------------------------ | :------------------------------------------------------------------------------------------- |
| InternalError         | 500 Internal Server Error | 所有未定义的其他错误。在有明确对应的其他类型的错误时（包括通用的和服务自定义的）不应该使用。 |
| InvalidVersion        | 404 NotFound              | 认证版本号不合法。                                                                           |
| InvalidAccessKeyId    | 403 Forbidden             | Access Key ID 不存在。                                                                       |
| AccessDenied          | 403 Forbidden             | 无权限访问对应的资源。                                                                       |
| InvalidHTTPAuthHeader | 400 BadRequest            | x-authorization 头域格式错误。                                                               |
| RequestExpired        | 400 BadRequest            | 请求超时。                                                                                   |
| SignatureDoesNotMatch | 400 Bad Request           | x-authorization 头域中附带的签名和服务端验证不一致。                                         |

<!-- | MalformedJSON         | 400 BadRequest            | JSON 格式不合法。                                                                            | -->
