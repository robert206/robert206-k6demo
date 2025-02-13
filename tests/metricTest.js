import http from 'k6/http';
import { check, sleep } from 'k6';
import { Gauge, Counter, Rate, Trend } from 'k6/metrics';

// Define custom metrics
let responseTimeGauge = new Gauge('response_time_gauge');
let requestCounter = new Counter('total_requests_counter');
let successRate = new Rate('success_rate');
let responseTimeTrend = new Trend('response_time_trend');

export let options = {
    stages: [
        { duration: '5s', target: 50 }, 
        { duration: '10s', target: 50 }, 
        { duration: '5s', target: 0 },  
    ],
};

export default function () {
    let res = http.get('https://test-api.k6.io/public/crocodiles/');

    // Update custom metrics
    responseTimeGauge.add(res.timings.duration); // Stores latest response time
    requestCounter.add(1); // Increments request count
    successRate.add(res.status === 200); // Tracks success rate
    responseTimeTrend.add(res.timings.duration); // Adds response time for trend analysis

    check(res, {
        'Status is 200': (r) => r.status === 200,
        'Response time < 500ms': (r) => r.timings.duration < 500,
        'Returns JSON': (r) => r.headers['Content-Type'] === 'application/json',
    });

    sleep(1); 
}
