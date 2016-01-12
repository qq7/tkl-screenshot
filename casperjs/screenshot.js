var casper = require('casper').create();
var fs = require('fs');
var system = require('system');

var scriptPath = system.args[system.args.length - 1].split('/');

if (scriptPath.length > 1) {
    scriptPath.pop();
    scriptPath.push('casperjs');
    scriptPath = scriptPath.join('/') + '/';
}

var capture = function (name) {
    casper.evaluate(function () {
        document.body.bgColor = 'white';
    });
    
    casper.capture('.art/' + name + '.png', {
        top: 0,
        left: 0,
        width: 640,
        height: 480
    });
}

casper.start('http://localhost', function () {
    casper.viewport(640, 480);

    services = fs.open('/tmp/services.txt', 'r');
    while (!services.atEnd()) {
        line = services.readLine();
        parts = line.split('=');

        name = parts[0];
        url  = parts[1];

        subscript = scriptPath + name + '.js';
        console.log(subscript);

        if (fs.exists(subscript)) {
            if (url != undefined) {
                require(subscript).execute('.art/' + name + '.png', url);
            } else {
                require(subscript).execute();
            }
        } else {
            if (url == undefined) {
                continue;
            } else {
                (function (name, url) {
                    casper.thenOpen(url, function () {
                        capture(name);
                    });
                })(name, url);
            }
        }
    }
});

casper.run();

