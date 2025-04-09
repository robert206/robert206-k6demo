import http from 'k6/http';
import exec from 'k6/execution';
import { check,test } from 'k6';

export let options = {
    stages: [
        { duration: '2s', target: 50 },  // Ramp up to 50 users in 5s
        { duration: '5s', target: 50 }, // Stay at 50 users for 10s
        { duration: '2s', target: 0 },   // Ramp down to 0 users in 5s
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],  // Fail if more than 1% of requests fail
        http_req_duration: ['p(95)<500'], // 95% of requests must complete within 500ms
        http_reqs: ['count>1000'],       // Ensure at least 100 requests are executed
        iteration_duration: [{ threshold: 'p(90)< 30' }], // 90% of iterations must complete within 1.5s
          
    },
    
};

export default function () {
    let res = http.get('https://test-api.k6.io/public/crocodiles/');
    
    // print resp body to console if DEBUG is set
    if (__ENV.DEBUG === 'true') {
        console.log(JSON.stringify(res, null, 2));
    }

    //hard abort of whole test if one of the request fails
    /* if ( res.status !== 201) {
        exec.test.abort('I just killed the whole test' + res.status); // =<  test.abort
    } */
    check(res, {
        'Is Status 200': (r) => r.status === 200,
        'Is Response time < 500ms': (r) => r.timings.duration < 500,
        'Does it Returns JSON': (r) => r.headers['Content-Type'] === 'application/json',
        'Does Body contains keyword': (r) => r.body.includes('crocodile'),
    });

}
