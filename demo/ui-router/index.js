var express = require('express');
var fs = require('fs');

var app = express();
var dir = __dirname;
var port = 8044;

app.use('/', express.static(dir+'/'));

//redirect index.html on every request
app.all('/*', function(req, res) {
	fs.readFile(dir+'/index.html', { encoding: 'utf8' }, function(err, file) {
		res.send(file);
	});
});

console.log('server started on port', port);
app.listen(port);