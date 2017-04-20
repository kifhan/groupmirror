var express = require('express'),
    app = express(),
    path = require('path'),
    server = require('http').Server(app),
    io = require('socket.io')({ // for perfomance of socket.io on Heroku.
      "transports": ["xhr-polling"],
      "polling duration": 10
    }).listen(server);

var saved_data = { contents: "// enjoy coding. \n" };

app.set('port', process.env.PORT || 3000);
app.use('/', express.static(path.join(__dirname, 'www')));

// Set up express server
server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

// Handle socket traffic
io.sockets.on('connection', function (socket) {
  socket.on('user_conect', function(data) {
		socket.emit('editorUpdate', saved_data);
	});
  // Relay chat data to all clients
	socket.on('editorUpdate', function(data) {
        saved_data = data;
		socket.broadcast.emit('editorUpdate', data);
	});

});
