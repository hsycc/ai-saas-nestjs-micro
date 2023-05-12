/*
 * @Author: hsycc
 * @Date: 2023-05-09 01:59:15
 * @LastEditTime: 2023-05-12 08:13:51
 * @Description:
 *
 */

module.exports = {
  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix'],

  // skip any questions you want
  skipQuestions: ['body', 'footer'],

  subjectLimit: 100,
  breaklineChar: '|',

  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true, // default is false

  // 自定义选项
  scopes: ['', 'api-gateway', 'user-svc', 'ai-svc'],
  // // it needs to match the value for field type. Eg.: 'fix'
  // scopeOverrides: {
  //   feat: [],
  //   fix: [
  //     { name: 'merge' },
  //     { name: 'style' },
  //     { name: 'e2eTest' },
  //     { name: 'unitTest' },
  //   ],
  // },

  usePreparedCommit: false, // to re-use commit from ./.git/COMMIT_EDITMSG
  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',
  types: [
    { value: 'dev', name: 'dev:      快速开发下提交非整体功能或者改动' },
    { value: 'feat', name: 'feat:     新功能' },
    { value: 'fix', name: 'fix:      修复' },
    { value: 'docs', name: 'docs:     文档变更' },
    { value: 'style', name: 'style:    代码格式(不影响代码运行的变动)' },
    {
      value: 'refactor',
      name: 'refactor: 重构(既不是增加feature，也不是修复bug)',
    },
    { value: 'perf', name: 'perf:     性能优化' },
    { value: 'test', name: 'test:     增加测试' },
    { value: 'chore', name: 'chore:    构建过程或辅助工具的变动' },
    { value: 'revert', name: 'revert:   回退' },
    { value: 'build', name: 'build:    打包' },
  ],
  messages: {
    type: '选择一种你的提交类型:',
    scope: '\n表示此次改动的范围 (可选):',
    customScope: '表示此次改动的自定义范围 (可选):',
    subject: '简短描述:',
    body: '详细描述. 使用 "|" 换行(可选):\n',
    breaking: '非兼容性说明 (可选):\n',
    footer: '关闭的 issue，例如：#31, #34(可选):\n',
    confirmCommit: '确认使用以上信息提交？(y/n/e/h)',
  },
};
