module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  // 🔹 Ahora Jest detecta pruebas dentro de carpetas `pruebas/`
  testMatch: [
    '**/?(*.)+(spec|test).[tj]s?(x)',
    '**/pruebas/**/*.spec.ts'
  ],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/main.ts',
    '!**/*.module.ts'
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',

  // 🔹 Permite imports absolutos como `import { X } from 'src/...';`
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
  },

  // 🔹 Permite hooks globales o extensiones (por ejemplo, jest-extended)
  setupFilesAfterEnv: ['<rootDir>/../jest.setup.ts'],

};


