import http from 'k6/http';
import { check } from 'k6';
import { generateNewUserBody } from '../common/generateData.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';


// Define test options
export let options = {
    vus: 5,  // Number of Virtual Users
    duration: '5s',
    //iterations: 100 // Total test duration
};


// Setup function->Runs once before the test starts)
export function setup() {
    //const URL = 'https://test-api.k6.io/user/register/';
    const URL = 'https://reqres.in/api/users';
    let { body, password } = generateNewUserBody();
    console.log(body);

    const response = http.post(URL, body, { headers: { 'Content-Type': 'application/json' } });

    check(response, {'User created successfully 201': (r) => r.status === 201});

    let createdUser = JSON.parse(response.body);

    return { username: createdUser.username, password: password };
}


// Main test exec - POST login with created user
export default function (data) {
    let params = { headers: { 'Content-Type': 'application/json' } };
    let body = JSON.stringify({
        username: data.username,
        password: data.password
    });

    let res = http.post('https://test-api.k6.io/auth/cookie/login/', body,params);

    check(res, {
        'Is Status 201': (r) => r.status === 200,
        'Is Data received < 32kB': (r) => r.body.size < 32768,
    });
    //sleep(0.5);
}


// Teardown function (Runs once after the test finishes)
export function teardown(data) {
    let headers = { headers: { 'Content-Type': 'application/json' } };
    let body = JSON.stringify({username: data.username});

    const res = http.post('https://test-api.k6.io/auth/cookie/logout/', body, { headers });
    check(res, {
        'Status is 200': (r) => r.status === 200,
       'Response time < 1s': (r) => r.timings.duration < 1000,
    });
} 


// k6 function from standard library for report outputs
export function handleSummary(data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Format: YYYY-MM-DDTHH-MM-SS
    const reportName = `report-${timestamp}`;

    return {
        stdout: textSummary(data, { indent: ' ', enableColors: true }), // CLI output on stdout
        [`../reports/${reportName}.html`]: htmlReport(data), // HTML report file -custom theme
        [`../reports/${reportName}.json`]: JSON.stringify(data, null, 2) // JSON report file
    };
}