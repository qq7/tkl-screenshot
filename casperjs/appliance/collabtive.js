var require = patchRequire(require);

exports.execute = function () {
    casper.thenOpen('http://localhost/', function () {
        casper.capture('collabtive-login.png');
        casper.fill('form#loginform', {
            'username': 'admin',
            'pass': 'turnkey'
        }, true);
    }).waitForUrl('http://localhost/index.php?mode=login', function () {
        casper.capture('collabtive-dashboard.png');
        casper.fill('form.main', {
            'name': 'Project X'
        }, true);
    }).thenOpen('http://localhost/managetask.php?action=showproject&id=1', function () {
        casper.fill('form.main', {
            'name': 'Member recruitment tasks'
        }, true);
        casper.fill('form#addtaskform2', {
            'title': 'Go to local coffee shop'
        }, true);
        casper.fill('form#addtaskform2', {
            'title': 'Go to local bar',
            'end': '12.12.2015'
        }, true);
        casper.fill('form#addtaskform2', {
            'title': 'Go to the park',
            'end': '12.12.2015'
        }, true);
        casper.wait(5000, function () {
            casper.capture('collabtive-tasklist.png');
        });
    });
}
