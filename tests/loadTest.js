import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '5s', target: 50}, // Ramp up to 50 users in 5s
        { duration: '10s', target: 50 }, // Stay at 10 users for 20s
        { duration: '5s', target: 0 },  // Ramp down to 0 users in 10s
    ],
};

export default function () {
    let res = http.get('https://test-api.k6.io/public/crocodiles/');

    check(res, {
        'Status is 200': (r) => r.status === 200,
        'Response time < 500ms': (r) => r.timings.duration < 500,
        'Returns JSON': (r) => r.headers['Content-Type'] === 'application/json',
    });

    sleep(1); 
}
