var require = patchRequire(require);

exports.execute = function() {
    casper.thenOpen('https://localhost:12322/', function () {
        casper.fillSelectors('form', {
            'input[name = username]' : 'root',
            'input[name = password]' : 'turnkey'
        });
        casper.click('input[type = submit]');
    }).then(function () {
        casper.capture('.art/adminer.png');
    });
}

