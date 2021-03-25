import http from 'http';
import { v4 } from 'uuid';
import { constants } from './constants.js';

export default class SocketServer {
    constructor({ port }) {
        this.port = port;
    }

    async initialize(eventEmitter) {
        const server = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Hey there!!');
        });

        server.on('upgrade', (req, socket) => {
            socket.id = v4();
            const headers = [
                'HTTP/1.1 101 Web Socket Protocol handshake',
                'Upgrade: WebSocket',
                'Connection: Upgrade',
                ''
            ].map(line => line.concat('\r\n')).join('');

            socket.write(headers);
            eventEmitter.emit(constants.event.NEW_USER_CONNECTED, socket);
        });

        return new Promise((resolve, reject) => {
            server.on('error', reject);
            server.listen(this.port, () => resolve(server));
        });
    }
}