var WebSocket = require('ws');

function RWebSocket(url, protocols, retryInterval) {
	this.url = url;
	this.protocols = protocols;
	this.retryInterval = retryInterval || 3000;
}

RWebSocket.prototype = {
	connect: function () {
		var self = this;

		this.client = new WebSocket(this.url, this.protocols);
		this.readyState = this.client.readyState;
		this.protocol = this.client.protocol;

		this.client.onopen = function () {
			clearTimeout(self.connectTimeout);
			self.connectTimeout = null;
			self.onopen();
		};

		this.client.onmessage = function (event) {
			self.onmessage(event);
		};

		this.client.onclose = function (event) {
			if (event.code === 1000) {
				self.onclose(event);
				self.onterminate();
			} else {
				self.onclose(event);
				clearTimeout(self.connectTimeout);
				self.connectTimeout = setTimeout(function () {
					self.connect();
				}, self.retryInterval);
			}
		};

		this.client.onerror = function (event) {
			self.onerror(event);
			if (event.code === 'ECONNREFUSED') {
				clearTimeout(self.connectTimeout);
				self.connectTimeout = setTimeout(function () {
					self.connect();
				}, self.retryInterval);
			}
		};
	},

	close: function (code, reason) {
		if (this.client) {
			if (code === 1000) {
				clearTimeout(this.connectTimeout);
				this.client.close(code, reason);
			} else {
				this.client.close(code, reason);
			}
		}
	},

	terminate: function (code, reason) {
		if (this.client) {
			clearTimeout(this.connectTimeout);
			this.client.close(code || 1000, reason);
		}
	},

	send: function (data) {
		if (this.client) {
			this.client.send(data);
		}
	},

	onopen: function () {},
	onmessage: function () {},
	onclose: function () {},
	onerror: function () {},
	onterminate: function () {}
};

module.exports = RWebSocket;
