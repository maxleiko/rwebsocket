var assert = require('assert');
var WebSocket = require('ws');

var RWebSocket = require('../rwebsocket');

var PORT = 9000;
var URL = 'ws://localhost:' + PORT;

describe('RWebSocket tests', function () {
	this.timeout(3000);
	this.slow(500);

	var server;

	function cleanServerClose(done) {
		server.clients.forEach(function (client) {
			client.close();
		});
		server.close(done);
	}

	beforeEach('init WebSocket server', function (done) {
		server = new WebSocket.Server({ port: PORT }, done);
	});

	afterEach('close WebSocket server', function (done) {
		cleanServerClose(done);
	});

	it('should connect when server is up', function (done) {
		var client = new RWebSocket(URL);
		client.connect();
		client.onopen = function () {
			client.close();
			done();
		};
	});

	it('should try to reconnect if server is down', function (done) {
		this.slow(1000);

		// close server properly
		cleanServerClose(function () {
			// re-up server after some time
			setTimeout(function () {
				server = new WebSocket.Server({ port: PORT });
			}, 200);
		});

		// try to connect to closed server
		var client = new RWebSocket(URL, null, 100);
		client.connect();
		client.onopen = function () {
			client.close();
			done();
		};
	});

	it('should be able to send message', function (done) {
		this.slow(1000);

		var MSG = 'Hello World!';

		// try to connect to closed server
		var client = new RWebSocket('ws://echo.websocket.org', null, 100);
		client.onmessage = function (evt) {
			assert.equal(evt.data, MSG);
			client.close();
			done();
		};
		client.onopen = function () {
			client.send(MSG);
		};

		client.connect();
	});
});
