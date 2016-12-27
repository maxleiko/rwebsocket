# rwebsocket [![Build Status](https://travis-ci.org/maxleiko/rwebsocket.svg?branch=master)](https://travis-ci.org/maxleiko/rwebsocket)
Simple auto-reconnect WebSocket adapter

### Install
```sh
npm i rwebsocket -S
```
or
```sh
yarn add rwebsocket
```

### Usage
```js
const RWebSocket = require('rwebsocket');

const client = new RWebSocket('ws://echo.websocket.org');

client.onopen = function () {
	// as soon as we are connected
	// just send an Hello World! to the server
	client.send('Hello World!');
};

client.onmessage = function (event) {
	// because the server is echo.websocket.org we should receive
	// "Hello World!" right after connection
	console.log('> ', event.data);
};

// connect
client.connect();
```

> If `ws://echo.websocket.org` is unreachable, RWebSocket will try to reconnect once every 3 seconds (default)

### API
The only modifications to the API are:
 - the ability to give a 3rd argument to the constructor to set the `retryInterval` in `ms`
 - the `#connect()` method to actually create a WebSocket and connect to the server

```js
const client = new RWebSocket('ws://echo.websocket.org', null, 25000);
```
> Reconnection attempts will be made once every 25 seconds  
> NB: the 'null' param is for the protocol because the constructor is the same as the [WebSocket RFC](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) + `retryInterval`
