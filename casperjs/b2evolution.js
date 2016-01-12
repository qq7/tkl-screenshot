var require = patchRequire(require);

exports.execute = function() {
    casper.thenOpen('http://localhost/blog4.php', function () {
        capture('b2evolution-photos');
    })
}
