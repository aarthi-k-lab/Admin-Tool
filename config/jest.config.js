module.exports = {
  rootDir: '../',
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: ['node_modules', 'src'],
  modulePaths: ['src'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  roots: ['<rootDir>/src/'],
  transformIgnorePatterns: [
    '/node_modules/',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  verbose: true,
  testResultsProcessor: 'jest-html-reporter',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov'],
  setupFiles: ['<rootDir>/config/enzyme.setup.js'],
};
