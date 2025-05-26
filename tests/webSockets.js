import ws from 'k6/ws';
import { check, sleep } from 'k6';


export const options = {
    vus: 5,
    iterations: 30,
    duration: '10s',
}

export default function () {
    const url = 'wss://echo.websocket.org';

    const res = ws.connect(url, null, function (socket) {
        socket.on('open', function open() {
            console.log('Connected to WebSocket server');
            socket.send('Hello, server!');
        });

        socket.on('message', function message(data) {
            console.log(`Received message: ${data}`);
            socket.close();
        });

        socket.on('close', function close() {
            console.log('Disconnected from WebSocket server');
        });

        socket.on('error', function error(err) {
            console.error(`Websocket died : ${err}`);
        });
    });

    check(res, { 'status is 101': (r) => r.status === 101 });
    sleep(1);
}