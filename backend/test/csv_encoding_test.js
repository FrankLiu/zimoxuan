var fs = require('fs');
var path = require('path');

var contents = fs.readFileSync(path.resolve(__dirname + '/x4AtEEREcWHtvDu2T_0.8350676211994141.out'));
var BOM = new Buffer('\uFEFF');
contents = Buffer.concat([BOM, contents]);
fs.writeFileSync(path.resolve(__dirname + '/x4AtEEREcWHtvDu2T_0.8350676211994141.csv'), contents);
