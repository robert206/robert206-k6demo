import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '5s', target: 50 },  // Ramp up to 50 users in 5s
        { duration: '10s', target: 50 }, // Stay at 50 users for 10s
        { duration: '5s', target: 0 },   // Ramp down to 0 users in 5s
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],  // Fail if more than 1% of requests fail
        http_req_duration: ['p(95)<500'], // 95% of requests must complete within 500ms
        http_reqs: ['count>100'],       // Ensure at least 100 requests are executed
        iteration_duration: [{ threshold: 'p(95)< 30' }], // 95% of iterations must complete within 1.5s
          
    },
    
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
