import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 10,  // Number of Virtual Users
    iterations: 100 // Total test duration
};

export function setup() 
{
    // do some stuff here before 
    // you can pass data from this to other default function  
    // executed only once per test run
}

export default function MainLoop(passedDataFromSetup) {  
    // Main test logic goes here
    // This is the default function that will be executed by k6    
}

// Teardown function (Runs once after the test finishes)
export function teardown(data) { 
    // do some stuff here after 
    // the main test in default function is finished 
    // executed only once per test run
}

