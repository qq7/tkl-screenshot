var require = patchRequire(require);

exports.execute = function(file, url) {
    casper.thenOpen(url, function () {
        casper.fill('form.ui_form', { user: 'root', pass: 'turnkey' }, true);
    }).then(function () {
        casper.capture(file);
    });
}

