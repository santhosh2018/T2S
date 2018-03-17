'use strict';
module.exports = {
    "env": {
        "mocha": true
    },
    "extends": "eslint-config-app-fabric",
    'rules': {
        'max-depth': [ 'ERROR', 6 ],
        'max-statements': [ 'ERROR', 25 ],
        'complexity': [ 'ERROR', 8 ]
    }
};
