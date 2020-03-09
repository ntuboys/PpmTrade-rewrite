module.exports = {
    'env': {
        "react-native/react-native": true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-native/all',
        'strict',
        'strict-react'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },    
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'plugins': [
        'react',
        'react-native'
    ],
    'parser': 'babel-eslint',
    'rules': {
        "filenames/match-regex": 0,
        "filenames/match-exported": 0,
        "filenames/no-index": 0        
    }
};