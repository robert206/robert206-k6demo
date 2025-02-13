import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    scenarios: {
        // iterations are not equally divided among VUs
        shared_iterations_scenario: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 100,
            maxDuration: '30s',
        },
        // iterations are equally divided among VUs
        per_vu_iterations_scenario: {
            executor: 'per-vu-iterations',
            vus: 5,
            iterations: 20,  // Each VU will execute 20 iterations
            maxDuration: '1m',
        },
        // fixed VUs number for fixed duration
        constant_vus_scenario: {
            executor: 'constant-vus',
            vus: 50,
            duration: '10s',
        },
        //ramp up/down scenario
        ramping_vus_scenario: {
            executor: 'ramping-vus',
            stages: [
              { duration: '3s', target: 5 }, // Start with 10 VUs
              { duration: '3s', target: 50 }, // Ramp up to 50 VUs
              { duration: '5s', target: 100 }, // Ramp down to 50 VUs
              { duration: '5s', target: 50 }, // Ramp down to 50 VUs
              { duration: '5s', target: 0 }, // Ramp down to 0 VUs
            ],
          },
        //Throughput Test
        constant_arrival_scenario: {
            executor: 'constant-arrival-rate',
            rate: 10, // 10 iterations per second
            timeUnit: '1s',
            duration: '20s',
            preAllocatedVUs: 15, // Start with 15 VUs before test is actually started
            maxVUs: 30, // Can scale up to 30 VUs
        },
        //Stress Test
        ramping_arrival_scenario: {
            executor: 'ramping-arrival-rate',
            startRate: 10, // Start with 10 iterations per second
            timeUnit: '1s',
            stages: [
              { duration: '5s', target: 10 }, // Ramp to 50 requests per second
              { duration: '10s', target: 100 }, // Ramp to 200 requests per second
              { duration: '5s', target: 0 }, // Ramp down to 0
            ],
            preAllocatedVUs: 50,
            maxVUs: 100,
          },
    },
  };


// default function executed everytime for each scenario given in options
export default function () {
    let res = http.get('https://test-api.k6.io/public/crocodiles/');

    check(res, {
        'Status is 200': (r) => r.status === 200,
        'Response time < 500ms': (r) => r.timings.duration < 500,
        'No teapot.Get some coffee': (r) => r.status !== 418,
    });

}