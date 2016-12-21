var require = patchRequire(require);

exports.execute = function () {
    casper.thenOpen('http://localhost/enter_bug.cgi', function () {
        casper.fill('form[name=login]', { 'Bugzilla_login': 'admin@example.com', 'Bugzilla_password': 'turnkey' }, true);
        /* casper.click('input#log_in'); */
    }).then(function () {
        casper.capture('bugzilla-add-new.png');
        casper.fill('form#Create', {
            'short_desc': 'Dummy Issue 1'
        }, false);
        casper.click('input#commit');
    }).thenOpen('http://localhost/enter_bug.cgi', function () {
        casper.fill('form#Create', {
            'short_desc': 'Dummy Issue 2',
            'bug_severity': 'v2_bug_severity'
        }, false);
        casper.capture('bugzilla-1.png');
        casper.click('input#commit');
        casper.capture('bugzilla-2.png');
    }).thenOpen('http://localhost/buglist.cgi?component=TestComponent&product=TestProduct', function () {
        casper.capture('bugzilla-list-bugs.png');
    })
}
