module.exports = {
    "extends": [
        "airbnb-base",
        "plugin:react/recommended",
    ],
    "env": {
        "browser": true,
        "node": true,
    },
    "rules": {
        "indent": ["error", 4],
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "no-console": "off",

        "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
        "no-param-reassign": ["error", { "props": false }],

        "react/prop-types": "off",
        "no-use-before-define": "off",
        "no-else-return": "off",
        "max-len": "off",
        "object-curly-newline": "off"
    },

    "plugins": [
        "react"
    ],

    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module",
        "allowImportExportEverywhere": true,
        "ecmaFeatures": {
            "jsx": true
        },
    },
}
