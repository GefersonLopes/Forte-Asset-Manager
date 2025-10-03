export default {
  root: true,
  ignorePatterns: ['dist/', 'coverage/'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: { project: ['tsconfig.json'], tsconfigRootDir: import.meta.dirname },
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier',
      ],
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
    },
  ],
};
