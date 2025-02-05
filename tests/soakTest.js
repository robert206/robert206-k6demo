import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '5s', target: 25 },    // Stage 1: Ramp up to 25 VUs in 5 seconds
        { duration: '10s', target: 50 },   // Stage 2: Ramp up to 50 VUs in 10 seconds
        { duration: '10s', target: 100 },  // Stage 3: Ramp up to 100 VUs in 10 seconds
        { duration: '15s', target: 100 },  // Stage 4: Hold 100 VUs for 15 seconds
        { duration: '5s', target: 50 },    // Stage 5: Ramp down to 50 VUs in 5 seconds
        { duration: '5s', target: 25 },    // Stage 6: Ramp down to 25 VUs in 5 seconds
        { duration: '5s', target: 0 },     // Stage 7: Ramp down to 0 VUs in 5 seconds
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'], // 95% of requests should be < 1000ms
        http_req_failed: ['rate<0.01'],    // Failure rate should be < 1%
    },
};

// Test Function (Executed by Each VU)
export default function () {
    let res = http.get('https://test-api.k6.io/public/crocodiles/');

    // Validate Response
    check(res, {
        'Status is 200': (r) => r.status === 200,
        'Response time is < 800ms': (r) => r.timings.duration < 800,
    });
}
