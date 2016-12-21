var casper = require('casper').create();
var fs = require('fs');
var system = require('system');

var scriptPath = system.args[0].split('/');

if (scriptPath.length > 1) {
    scriptPath.pop();
    scriptPath.push('casperjs');
    scriptPath.push('appliances');
    scriptPath = scriptPath.join('/') + '/';
}

var capture = function (name) {
    casper.evaluate(function () {
        document.body.bgColor = 'white';
    });
    
    casper.capture('.art/' + name + '.png', {
        top: 0,
        left: 0,
        width: 1024,
        height: 768
    });
}

casper.start('http://localhost', function () {
    casper.viewport(1024, 768);

    subscript = scriptPath + name + '.js';
    console.log(subscript);

    if (fs.exists(subscript)) {
        require(subscript).execute();
    }
});

casper.run();

