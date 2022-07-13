module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'linebreak-style': ['off', 'windows'],
    'no-mixed-spaces-and-tabs': ['off', 'windows'],
    'no-consol': 'off',
    'no-var': 'error', // 不能使用var声明变量
    'no-extra-semi': 'error',
    '@typescript-eslint/indent': ['error', 2],
    'import/extensions': 'off',
    indent: ['error', 2, { SwitchCase: 1 }], // error类型，缩进2个空格
    'space-before-function-paren': 0, // 在函数左括号的前面是否有空格
    'eol-last': 0, // 不检测新文件末尾是否有空行
    semi: ['error', 'never'], // 在语句后面加分号
    // 'no-console': ['error', { allow: ['log', 'warn'] }], // 允许使用console.log()
    'arrow-parens': 0,
    'no-new': 0, //允许使用 new 关键字
    'comma-dangle': [2, 'never'], // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，always-multiline多行模式必须带逗号，单行模式不能带逗号
    'no-undef': 0
  },
  ignorePatterns: ['template/**/*']
}
