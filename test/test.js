const assert = require('assert');

describe('node-processlist', () => {
    it('should work on Windows', () => {
        assert.equal(process.platform, 'win32');
    });
});
