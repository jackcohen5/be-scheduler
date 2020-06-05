module.exports = {
    roots: ['<rootDir>/src'],
    testRegex: '((\\.|/*.)(test))\\.js?$',
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    modulePaths: ['<rootDir>/src'],
    moduleFileExtensions: ['js', 'json'],
    setupFilesAfterEnv: ['<rootDir>/config/setupJest.js'],
}
