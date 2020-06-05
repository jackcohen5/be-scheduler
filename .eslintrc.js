module.exports = {
    parser: "babel-eslint",
    settings: {
        'import/resolver': {
            "node": {
                'paths': ['src']
            }
        }
    },
    extends: [
        '@tophat/eslint-config/base',
        '@tophat/eslint-config/jest',
    ]
}
