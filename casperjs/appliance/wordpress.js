var require = patchRequire(require);

exports.execute = function() {
    casper.thenOpen('http://localhost/wp-login.php', function () {
        casper.fill('form#loginform', { log: 'admin', pwd: 'turnkey' }, false);
        casper.click('#wp-submit');
    }).then(function () {
        casper.capture('wordpress-admin.png');
    }).thenOpen('http://localhost/wp-admin/post-new.php', function () {
	casper.capture('wordpress-new-post.png');
    })
}

