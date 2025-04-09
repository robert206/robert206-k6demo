import { SharedArray } from 'k6/data';
import http from 'k6/http';
import { check } from 'k6';

//const allUsers = JSON.parse(open('../common/users.json'));

// Load data from data.json into a shared array (only once per test run)
// must be called from init context 
const allUsers = new SharedArray('Users data', function() {
    return JSON.parse(open('../common/users.json'));
  });


export let options = {
  vus: 2,
  iterations: 2,
};

export default function () {
  // Pick a random user from the shared array
  const user = allUsers[Math.floor(Math.random() * allUsers.length)];

  // Send a request using the user data (example POST request)
  let res = http.post('https://reqres.in/api/users', JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json' },
  });

  // Check the response status
  check(res, {
    'Status is 201': (r) => r.status === 201,
  });

}
