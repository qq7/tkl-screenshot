var require = patchRequire(require);

exports.execute = function() {
    casper.thenOpen('https://localhost/index.php/login', function () {
        casper.fill('form', {
            'uName' : 'admin',
            'uPassword' : 'turnkey'
        }, true);
    }).thenOpen('http://localhost/index.php/dashboard', function () {
        casper.capture('concrete5-dashboard.png');
    }).thenOpen('http://localhost/index.php/dashboard/pages/themes', function () {
        casper.capture('concrete5-themes.png');
    });
}

