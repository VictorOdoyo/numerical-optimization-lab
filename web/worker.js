import {respond} from '../src/protocol.js';self.onmessage=({data})=>self.postMessage(respond(data));
