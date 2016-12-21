var require = patchRequire(require);

exports.execute = function() {
    casper.thenOpen('https://localhost:12321/samba/index.cgi', function () {
        capture('samba-webmin');
    }).thenOpen('https://localhost:12321/samba/conf_smb.cgi', function () {
        capture('samba-webmin-conf');
    })
}
