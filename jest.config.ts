import type {Config} from '@jest/types';

const config: Partial<Config.InitialOptions> = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './reports/unittest/',
        outputName: 'junit.xml',
      },
    ],
  ],
  collectCoverage: true,
  coverageReporters: ['json-summary', 'lcov', 'text', 'cobertura'],
  coverageDirectory: './reports/coverage/',
};
export default config;
