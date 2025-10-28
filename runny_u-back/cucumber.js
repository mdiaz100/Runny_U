module.exports = {
  default: {
    require: ['test/e2e/step-definitions/**/*.steps.ts'],
    requireModule: ['ts-node/register'],
    format: [
      '@serenity-js/cucumber',
      'progress-bar',
      'json:reports/cucumber-report.json',
    ],
    formatOptions: {
      specDirectory: 'test/e2e/features',
    },
    paths: ['test/e2e/features/**/*.feature'],
    publishQuiet: true,
  },
};