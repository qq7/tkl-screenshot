var require = patchRequire(require);

exports.execute = function () {
/*
    casper.thenOpenAndEvaluate('http://localhost/', function () {
        document.querySelector('.ui_tabs_nav:nth-child(1)').classList = '';
        document.querySelector('.ui_tabs_nav:nth-child(2)').classList = 'ui-tabs-selected';
    }).then(function () {
        casper.capture('cakephp-about.png');
    }).thenEvaluate(function () {
        document.querySelector('.ui_tabs_nav:nth-child(2)').classList = '';
        document.querySelector('.ui_tabs_nav:nth-child(3)').classList = 'ui-tabs-selected';
    }).then(function () {
        casper.capture('cakephp-checks.png');
    })
    */

    casper.thenOpen('http://localhost/', function () {
        casper.click('a[href="#about"]');
        casper.wait(3000);
        casper.capture('codeigniter-about.png');
    }).thenOpen('http://localhost/user_guide/', function () {
        casper.capture('codeigniter-userguide.png');
    })
}
