var require = patchRequire(require);

exports.execute = function() {
    casper.thenOpen('http://localhost/', function () {
        capture('drupal-landing');
        casper.fill('form#user-login-form', {
            'name': 'admin',
            'pass': 'turnkey'
        }, true);
    }).thenOpen('http://localhost/admin/', function () {
        capture('drupal-admin');
    }
}
