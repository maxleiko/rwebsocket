var WebSocket = require('ws');

function RWebSocket(url, protocols, retryInterval) {
	this.url = url;
	this.protocols = protocols;
	this.retryInterval = retryInterval || 3000;
}

RWebSocket.prototype = {
	connect: function () {
		var self = this;
		var connectTimeout;

		this.client = new WebSocket(this.url, this.protocols);
		this.readyState = this.client.readyState;
		this.protocol = this.client.protocol;

		this.client.onopen = function () {
			clearTimeout(connectTimeout);
			connectTimeout = null;
			self.onopen();
		};

		this.client.onmessage = function (event) {
			self.onmessage(event);
		};

		this.client.onclose = function (event) {
			switch (event.code) {
				case 1000:
					// normal close
					break;

				default:
					// abnormal close
					if (!connectTimeout) {
						connectTimeout = setTimeout(function () {
							self.connect();
						}, self.retryInterval);
					}
			}
			self.onclose(event);
		};

		this.client.onerror = function (event) {
			switch (event.code) {
				case 'ECONNREFUSED':
					if (!connectTimeout) {
						connectTimeout = setTimeout(function () {
							self.connect();
						}, self.retryInterval);
					}
					break;

				default:
					self.onerror(event);
					break;
			}
			self.onerror(event);
		};
	},

	close: function (code, reason) {
		if (this.client) {
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
};

module.exports = RWebSocket;
