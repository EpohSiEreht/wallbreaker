var express = require('express'),
	app	= express();	

app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
	res.sendFile('index.html');
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log('Listening on '+ port);
});