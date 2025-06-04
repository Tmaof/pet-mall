module.exports = {
  /** 通常是一个很好的 ESLint 实践，用于指示此文件是项目使用的根级文件，ESLint 不应该在这个目录之外搜索配置文件。 */
  root: true,
  // 忽略 dist 目录
  ignorePatterns: ['dist/**/*'],
  extends: [
    '@mao-fu/eslint-config',
    '@mao-fu/eslint-config/import',
    '@mao-fu/eslint-config/typescript',
  ],
  rules: {
    // 要求构造函数名称以大写字母开头，但允许以 @ 开头（装饰器）
    'new-cap': ['error', { capIsNewExceptionPattern: '^@*' }],
    // ts 中配置检查未使用的变量
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
  },
};
