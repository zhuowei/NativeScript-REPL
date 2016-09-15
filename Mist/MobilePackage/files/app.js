"use strict";
var application = require("application");

function startREPL() {

	/* helper functions available to evaled code */
	global.log = function() {
		var b = [];
		for (var i in arguments){
			b.push(String(arguments[i]));
		}
		b.push("\n");
		writeString(outstream, b.join(" "));
	}

	global.dir = function(o) {
		var b = [];
		for (var i in o) {
			b.push(i);
		}
		return b.join("\n");
	}

	var instreamRef = new interop.Reference();
	var outstreamRef = new interop.Reference();
	CFStreamCreatePairWithSocketToHost(null, "192.168.1.14", 1337, instreamRef, outstreamRef);
	var instream = instreamRef.value;
	var outstream = outstreamRef.value;
	instream.open();
	outstream.open();
	var inBuf = new ArrayBuffer(1);
	var inBufByteView = new Uint8Array(inBuf);
	var curBuf = "";
	function writeString(outstream, outStr) {
		var outBuf = new ArrayBuffer(outStr.length);
		var outBufByteView = new Uint8Array(outBuf);
		for (var i = 0; i < outStr.length; i++) {
			outBufByteView[i] = outStr.charCodeAt(i) & 0xff;
		}
		var retval = outstream.writeMaxLength(outBuf, outBuf.byteLength);
		if (outBuf.byteLength != retval) {
			throw new Error("write length wrong: " + outBuf.byteLength + ":" + retval);
		}
	}
	writeString(outstream, "NativeScript REPL connected: ready?\n");
	while (true) {
		var geval = eval;
		var len = instream.readMaxLength(inBuf, inBuf.byteLength);
		if (len == -1) throw new Error("connection closed");
		if (len != 1) continue;
		var myChar = inBufByteView[0];
		if (myChar == 0xa) { // \n
			var outStr = null;
			if (curBuf == "die") throw new Error("forcing a crash");
			try {
				outStr = String(geval(curBuf));
			} catch (e) {
				outStr = String(e);
			}
			writeString(outstream, outStr + "\n");
			curBuf = "";
		} else {
			curBuf += String.fromCharCode(myChar);
		}
	}
}

application.on("launch", function(args) {
	setTimeout(startREPL, 1);
});
application.start({moduleName: "../main-page"});