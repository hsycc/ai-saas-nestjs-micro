<!--
 * @Author: hsycc
 * @Date: 2023-05-12 09:29:29
 * @LastEditTime: 2023-05-28 05:51:33
 * @Description: #
 *
-->

# openai

- [docs](https://platform.openai.com/docs/api-reference/authentication)
- [github](https://github.com/openai/openai-node)

- [How to use stream: true](https://github.com/openai/openai-node/issues/18)
- [Streaming completions](https://github.com/justinmahar/openai-ext/)

##

chat/completions

system 类的聊天消息通常是指代当前聊天会话的全局信息，例如聊天会话的 ID、当前的时间戳、当前的聊天主题等。这些信息对于聊天机器人来说非常重要，因为它们可以帮助聊天机器人更好地理解当前聊天上下文，从而生成更准确的自动补全建议。

另一方面，assistant 类的聊天消息通常是指代聊天机器人自身的信息，例如聊天机器人的名称、聊天机器人的介绍、聊天机器人的提示等。这些信息通常是由聊天机器人自己发出的，用于与用户进行互动，并帮助用户更好地了解聊天机器人。

因此，system 和 assistant 这两个类别的聊天消息在 OpenAI 聊天接口中扮演着非常重要的角色，它们可以帮助聊天机器人更好地理解当前聊天上下文，从而生成更准确的自动补全建议。
