process.env.TS_NODE_PROJECT = './tsconfig.e2e.json';

module.exports = {
  default: {
    paths: ['e2e/features/**/*.feature'],
    
   
    require: [
      'e2e/step-definitions/**/*.ts',
      'e2e/support/**/*.ts'
    ],
    

    requireModule: ['ts-node/register'],
    

    format: [
      'progress-bar',
      'html:target/cucumber-report.html',
      'json:target/cucumber-report.json',
      '@serenity-js/cucumber'
    ],
    
 
    formatOptions: {
      snippetInterface: 'async-await'
    },
    
   
    worldParameters: {
      baseURL: process.env.BASE_URL || 'http://localhost:4200'
    },
    

    parallel: 1
  }
};