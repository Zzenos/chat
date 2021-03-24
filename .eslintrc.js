module.exports = {
    "env": {
        "browser": true,
        "amd": true,
        "commonjs": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "parser": "babel-eslint" // 默认espree
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "no-undef": 0
    }
};