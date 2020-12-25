'use strict';

const test = require('tape');
const sinon = require('sinon');

const promisedCommand = require('../lib/command-promised');

test('Module should be bootstraped OK', t => {
    t.ok(promisedCommand);
    t.end();
});