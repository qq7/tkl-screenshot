var require = patchRequire(require);

exports.execute = function () {
    casper.thenOpen('http://localhost/samples', function () {
        casper.capture('asp-net-samples.png');
    }).thenOpen('http://docs.go-mono.com', function () {
        casper.capture('mono-docs.png');
    })
}
