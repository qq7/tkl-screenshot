var require = patchRequire(require);

exports.execute = function() {
    casper.thenOpen('http://localhost/admin/login/', function () {
        casper.fill('form#login-form', {
            'username': 'admin',
            'password': 'turnkey'
        }, true);
    }).waitForUrl('http://localhost/admin/', function () {
        capture('django-admin');
    }).thenOpen('http://localhost/doc/index.html', function () {
        capture('django-documentation');
    });
}
