var require = patchRequire(require);

exports.execute = function() {
    casper.thenOpen('http://localhost/start?do=login', function () {
        casper.fill('form#dw__login', {
            'u': 'admin',
            'p': 'turnkey'
        }, true);
    }).thenOpen('http://localhost/start?do=admin', function () {
        capture('dokuwiki-admin');
    }).thenOpen('http://localhost/start?do=edit', function () {
        capture('dokuwiki-edit');
    })
}
