var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '')); // ← adjust
app.listen(7000, function() { 
	console.log('listening 7000'); 
	console.log(__dirname);
});