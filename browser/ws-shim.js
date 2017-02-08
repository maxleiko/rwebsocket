/* eslint-env browser */
'use strict';

WebSocket.prototype.on = function (event, handler) {
  this['on' + event] = handler;
};
WebSocket.prototype.off = function (event, handler) {
  if (typeof handler === 'function') {
    if (this['on' + event] === handler) {
      delete this['on' + event];
    }
  }
};

module.exports = WebSocket;
module.exports.Server = function WebSocketServer() {
  throw new Error('WebSocketServer is not supported in browser environment.');
};
