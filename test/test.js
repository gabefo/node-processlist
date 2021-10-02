const assert = require('assert');

describe('processlist', () => {
    it('should work on Windows', () => {
        assert.equal(process.platform, 'win32');
    });
});
