var fs = require('fs');
var path = require('path');

var contents = fs.readFileSync(path.resolve(__dirname + '/QNDSojmwKHnihiELH_0.030202892841771245.out'));
var BOM = new Buffer('\uFEFF');
contents = Buffer.concat([BOM, contents]);
fs.writeFileSync(path.resolve(__dirname + '/QNDSojmwKHnihiELH_0.030202892841771245.csv'), contents);
