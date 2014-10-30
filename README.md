oscillate: A JavaScript OSC toolbelt
---------------------------------

[![Build Status](https://travis-ci.org/pgk/node-oscillate.svg?branch=master)](https://travis-ci.org/pgk/node-oscillate.svg?branch=master)

`oscillate` (abbr. `osc`) is an OSC toolbelt for the server and the browser 

## Usage

creating an osc message

``` js
var OSC = require('oscillate');

var msg = OSC.message('/recipient', 'noteon', 64 127);

var binBuffer = OSC.message.encode('/recipient', 'noteon', 64 127);

var decodedMessage = OSC.message.decode(binBuffer);

```

a simple osc server

``` js

var OSC = require('oscillate');

var server = OSC.server('tcp', {host: "localhost", port: 8080})

server.on('/recipient', function (noteOnOrOff, noteValue, velocity) {
	console.log(noteOnOrOff);
	this.sender.send(OSC.message('/sender', 'noteoff', 64));
});

server.run();

```

### The fine print

`oscillate` aims to be an OSC utility library to be used for music/synthesis/sound/video control on a browser and/or peer to peer environment. It is really alpha right now. The working part is the OSC Server and Client for `node`. You can have a look at the examples for communicating with Max/MSP.
working release v0.0.1


CREDITS/LICENCE:
This library is derived partly from node-osc, that is a port of pyOSC. It also uses jspack.
Licence is MIT.
